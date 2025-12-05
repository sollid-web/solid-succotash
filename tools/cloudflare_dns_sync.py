"""Utility to upsert WolvCapital DNS records in Cloudflare.

Usage:
    python tools/cloudflare_dns_sync.py --zone-id ZONE_ID [--records-file ops/cloudflare_dns_records.json]

Environment variables:
    CF_API_TOKEN   Cloudflare API token with DNS:Edit on the zone

The records file must be JSON with the structure:
{
  "records": [
    {"type": "TXT", "name": "@", "content": "...", "ttl": 3600, "proxied": false}
  ]
}
"""
from __future__ import annotations

import argparse
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib import error, parse, request

API_BASE = "https://api.cloudflare.com/client/v4"


def _read_body(resp: Any) -> dict:
    body = resp.read().decode("utf-8")
    if not body:
        return {}
    return json.loads(body)


def cf_request(
    method: str,
    path: str,
    token: str,
    data: dict | None = None,
    params: dict | None = None,
) -> dict:
    url = f"{API_BASE}{path}"
    if params:
        url = f"{url}?{parse.urlencode(params)}"

    req = request.Request(url, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")

    payload = None
    if data is not None:
        payload = json.dumps(data).encode("utf-8")
        req.data = payload

    try:
        with request.urlopen(req) as resp:
            return _read_body(resp)
    except error.HTTPError as exc:  # pragma: no cover - network failure
        detail = exc.read().decode("utf-8")
        raise SystemExit(
            f"Cloudflare API error {exc.code} for {method} {path}: {detail}"
        ) from exc


@dataclass
class DNSRecord:
    type: str
    name: str
    content: str
    ttl: int = 3600
    proxied: bool = False
    comment: str | None = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> DNSRecord:
        return cls(
            type=data["type"].upper(),
            name=data["name"],
            content=data["content"],
            ttl=int(data.get("ttl", 3600)),
            proxied=bool(data.get("proxied", False)),
            comment=data.get("comment"),
        )


def load_records(path: Path) -> list[DNSRecord]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    records = data.get("records", [])
    return [DNSRecord.from_dict(rec) for rec in records]


def normalize_name(name: str, zone_name: str) -> str:
    if name in ("@", zone_name):
        return zone_name
    if name.endswith(zone_name):
        return name
    return f"{name}.{zone_name}".replace("..", ".")


def get_zone_details(zone_id: str, token: str) -> dict:
    result = cf_request("GET", f"/zones/{zone_id}", token)
    return result["result"]


def fetch_existing_record(
    zone_id: str,
    token: str,
    record: DNSRecord,
    fqdn: str,
) -> dict | None:
    params = {"type": record.type, "name": fqdn}
    result = cf_request(
        "GET",
        f"/zones/{zone_id}/dns_records",
        token,
        params=params,
    )
    records = result.get("result", [])
    return records[0] if records else None


def record_needs_update(existing: dict, desired: DNSRecord) -> bool:
    if existing["content"].strip() != desired.content.strip():
        return True
    if int(existing.get("ttl", 0)) != desired.ttl:
        return True
    if bool(existing.get("proxied", False)) != desired.proxied:
        return True
    return False


def upsert_record(
    zone_id: str,
    token: str,
    record: DNSRecord,
    fqdn: str,
    dry_run: bool,
) -> None:
    existing = fetch_existing_record(zone_id, token, record, fqdn)
    payload = {
        "type": record.type,
        "name": fqdn,
        "content": record.content,
        "ttl": record.ttl,
        "proxied": record.proxied,
        "comment": record.comment,
    }

    if existing is None:
        action = "CREATE"
        endpoint = f"/zones/{zone_id}/dns_records"
        method = "POST"
    elif record_needs_update(existing, record):
        action = "UPDATE"
        endpoint = f"/zones/{zone_id}/dns_records/{existing['id']}"
        method = "PUT"
    else:
        print(f"SKIP  {record.type:<5} {fqdn} (no changes)")
        return

    print(f"{action} {record.type:<5} {fqdn}")
    if dry_run:
        return

    result = cf_request(method, endpoint, token, data=payload)
    if not result.get("success", False):  # pragma: no cover - API failure
        raise SystemExit(f"Cloudflare API returned error: {result}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync DNS records via Cloudflare API"
    )
    parser.add_argument(
        "--zone-id",
        required=True,
        help="Cloudflare zone identifier",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("CF_API_TOKEN"),
        help="Cloudflare API token (or set CF_API_TOKEN)",
    )
    parser.add_argument(
        "--records-file",
        type=Path,
        default=Path("ops/cloudflare_dns_records.json"),
        help="Path to records JSON file",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print actions without calling API",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.token:
        raise SystemExit(
            "Cloudflare API token missing. Set CF_API_TOKEN or pass --token."
        )

    if not args.records_file.exists():
        message = (
            "Records file "
            f"{args.records_file} not found. "
            "Copy ops/cloudflare_dns_records.example.json first."
        )
        raise SystemExit(message)

    zone = get_zone_details(args.zone_id, args.token)
    zone_name = zone["name"]
    print(f"Loaded zone {zone_name} ({args.zone_id})")

    records = load_records(args.records_file)
    for record in records:
        fqdn = normalize_name(record.name, zone_name)
        upsert_record(args.zone_id, args.token, record, fqdn, args.dry_run)

    print("Done.")


if __name__ == "__main__":
    main()
