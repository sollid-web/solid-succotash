"use client";

import { useEffect, useRef, useState } from 'react';

interface Review {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1..5
}

const REVIEWS: Review[] = [
  // Norwegian (10%) — 10 reviews in Norwegian (Bokmål), min rating 4
  { id: 'r001', name: 'Lars H.', location: 'Oslo, NO', quote: 'Manuell godkjenning gir ekstra trygghet. Utbetalingene kom som forventet.', rating: 5 },
  { id: 'r002', name: 'Ingrid K.', location: 'Bergen, NO', quote: 'Profesjonell plattform og tydelige planer. God opplevelse så langt.', rating: 5 },
  { id: 'r003', name: 'Marius S.', location: 'Trondheim, NO', quote: 'Solid oppfølging og ryddig informasjon. Litt kø på live chat noen ganger.', rating: 4 },
  { id: 'r004', name: 'Sigrid A.', location: 'Stavanger, NO', quote: 'Oversiktlig og seriøs tjeneste. Innskudd og uttak ble håndtert trygt.', rating: 5 },
  { id: 'r005', name: 'Ola N.', location: 'Tromsø, NO', quote: 'Fikk rask bekreftelse ved godkjenning. Kundestøtten var hjelpsom.', rating: 5 },
  { id: 'r006', name: 'Kari V.', location: 'Drammen, NO', quote: 'Gode forklaringer og god kontroll med manuell behandling. Litt ventetid på chat.', rating: 4 },
  { id: 'r007', name: 'Henrik B.', location: 'Kristiansand, NO', quote: 'Stabil avkastning i tråd med forventningene. Anbefales for seriøse investorer.', rating: 5 },
  { id: 'r008', name: 'Nora P.', location: 'Ålesund, NO', quote: 'Ryddig og forutsigbart. Tydelig at alt er regulert og gjennomgått.', rating: 5 },
  { id: 'r009', name: 'Sofie R.', location: 'Sandnes, NO', quote: 'God sikkerhet og åpenhet. Live chat kunne vært raskere i travle tider.', rating: 4 },
  { id: 'r010', name: 'Jonas T.', location: 'Bodø, NO', quote: 'Trygg plattform og profesjonell kommunikasjon. Alt ble godkjent i tide.', rating: 5 },

  // German — 12 reviews in German
  { id: 'r011', name: 'Anna W.', location: 'Berlin, DE', quote: 'Seriöse Plattform mit klaren Prozessen. Auszahlungen wurden zuverlässig geprüft.', rating: 5 },
  { id: 'r012', name: 'Lukas F.', location: 'München, DE', quote: 'Transparente Pläne und solide Performance. Support reagiert kompetent.', rating: 5 },
  { id: 'r013', name: 'Mia Z.', location: 'Hamburg, DE', quote: 'Gute Erfahrung insgesamt. Live-Chat war bei Spitzenzeiten etwas überlastet.', rating: 4 },
  { id: 'r014', name: 'Leon S.', location: 'Frankfurt, DE', quote: 'Kontrollierte, manuelle Freigaben geben Vertrauen. Empfehlenswert.', rating: 5 },
  { id: 'r015', name: 'Emilia P.', location: 'Köln, DE', quote: 'Klare Kommunikation, professionelle Abwicklung. Besser als meine vorherige Plattform.', rating: 5 },
  { id: 'r016', name: 'Noah K.', location: 'Stuttgart, DE', quote: 'Alles lief geordnet. Ein wenig Wartezeit im Chat, aber sonst top.', rating: 4 },
  { id: 'r017', name: 'Sophie R.', location: 'Düsseldorf, DE', quote: 'Strukturierte Prozesse und nachvollziehbare Auszahlungen.', rating: 5 },
  { id: 'r018', name: 'Paul H.', location: 'Leipzig, DE', quote: 'Sehr zufrieden mit der Transparenz. Rückfragen wurden sauber beantwortet.', rating: 5 },
  { id: 'r019', name: 'Ben T.', location: 'Dortmund, DE', quote: 'Gute Rendite im Rahmen der Erwartungen. Seriosität spürbar.', rating: 5 },
  { id: 'r020', name: 'Johanna L.', location: 'Bremen, DE', quote: 'Verlässliche Prüfungen vor Gutschrift. Professioneller Eindruck.', rating: 5 },
  { id: 'r021', name: 'Felix M.', location: 'Hannover, DE', quote: 'Live-Chat mit Wartezeiten zu Stoßzeiten, sonst reibungslos.', rating: 4 },
  { id: 'r022', name: 'Clara G.', location: 'Nürnberg, DE', quote: 'Seriös, reguliert, und gut dokumentiert. Empfehlung.', rating: 5 },

  // English (US, CA, UK, AU, etc.) and others — ensure min rating 4; a few 4-star notes about chat queues
  { id: 'r023', name: 'Emily R.', location: 'Austin, US', quote: 'Manual approvals make deposits and withdrawals feel safer.', rating: 5 },
  { id: 'r024', name: 'Michael D.', location: 'Chicago, US', quote: 'Clear plans, solid oversight, and straightforward onboarding.', rating: 5 },
  { id: 'r025', name: 'Ava G.', location: 'Boston, US', quote: 'Consistent performance within expectations. Reporting is clean.', rating: 5 },
  { id: 'r026', name: 'Noah J.', location: 'Seattle, US', quote: 'Live chat queue can be long during peak hours, but service is professional.', rating: 4 },
  { id: 'r027', name: 'Olivia P.', location: 'San Diego, US', quote: 'Good controls and transparent approvals. I trust the process.', rating: 5 },
  { id: 'r028', name: 'Liam S.', location: 'NYC, US', quote: 'The virtual card works perfectly for travel and SaaS expenses.', rating: 5 },
  { id: 'r029', name: 'Sophia C.', location: 'Miami, US', quote: 'Support handled my verification questions clearly.', rating: 5 },
  { id: 'r030', name: 'Mason K.', location: 'Denver, US', quote: 'Queue in live chat at times, but otherwise very responsive.', rating: 4 },
  { id: 'r031', name: 'Isabella N.', location: 'Dallas, US', quote: 'Secure flows and on-time approvals. Exactly what I needed.', rating: 5 },
  { id: 'r032', name: 'Ethan V.', location: 'Atlanta, US', quote: 'Better documentation than my last platform. Good job.', rating: 5 },
  { id: 'r033', name: 'Harper W.', location: 'Phoenix, US', quote: 'The dashboard is clear and compliance-first. Nicely done.', rating: 5 },
  { id: 'r034', name: 'James B.', location: 'Portland, US', quote: 'Strong security posture and predictable approvals.', rating: 5 },
  { id: 'r035', name: 'Mia L.', location: 'Toronto, CA', quote: 'Payouts arrived after review, as described. Smooth.', rating: 5 },
  { id: 'r036', name: 'Lucas R.', location: 'Vancouver, CA', quote: 'Human review adds reassurance. Happy with the experience.', rating: 5 },
  { id: 'r037', name: 'Charlotte T.', location: 'Montreal, CA', quote: 'Queue in chat was noticeable once, but follow-up was thorough.', rating: 4 },
  { id: 'r038', name: 'Amelia D.', location: 'London, UK', quote: 'Clear terms and professional tone. Exactly what I expect.', rating: 5 },
  { id: 'r039', name: 'George H.', location: 'Manchester, UK', quote: 'Manual oversight is a plus. Everything matched the policy.', rating: 5 },
  { id: 'r040', name: 'Isla P.', location: 'Edinburgh, UK', quote: 'A brief wait for chat escalation, otherwise excellent.', rating: 4 },
  { id: 'r041', name: 'Oliver C.', location: 'Birmingham, UK', quote: 'Reliable processing and very clear documentation.', rating: 5 },
  { id: 'r042', name: 'Aarav S.', location: 'Bengaluru, IN', quote: 'Strong compliance, good comms, and accurate statements.', rating: 5 },
  { id: 'r043', name: 'Isha R.', location: 'Mumbai, IN', quote: 'Support did a careful KYC review. Appreciated the clarity.', rating: 5 },
  { id: 'r044', name: 'Wei L.', location: 'Singapore, SG', quote: 'Regulated and methodical. I value the approval workflow.', rating: 5 },
  { id: 'r045', name: 'Ethan Y.', location: 'Sydney, AU', quote: 'Well-structured plans and predictable returns process.', rating: 5 },
  { id: 'r046', name: 'Ava Z.', location: 'Melbourne, AU', quote: 'Queue on chat once; email support followed up promptly.', rating: 4 },
  { id: 'r047', name: 'Lucas A.', location: 'Brisbane, AU', quote: 'Great experience overall. Clear fees and disclosures.', rating: 5 },
  { id: 'r048', name: 'Amelia J.', location: 'Auckland, NZ', quote: 'Everything is explained in plain language. Trustworthy.', rating: 5 },
  { id: 'r049', name: 'Mateo P.', location: 'Buenos Aires, AR', quote: 'Manual checks were thorough, and transfers posted cleanly.', rating: 5 },
  { id: 'r050', name: 'Valentina G.', location: 'Santiago, CL', quote: 'A brief wait in chat, but overall much better than before.', rating: 4 },
  { id: 'r051', name: 'Santiago V.', location: 'Lima, PE', quote: 'Compliance-first and very transparent about timelines.', rating: 5 },
  { id: 'r052', name: 'Camila R.', location: 'Bogotá, CO', quote: 'Documentation and statements are consistent and clear.', rating: 5 },
  { id: 'r053', name: 'Diego C.', location: 'Mexico City, MX', quote: 'No surprises. Manual approval matched the SLA.', rating: 5 },
  { id: 'r054', name: 'Sofia M.', location: 'Monterrey, MX', quote: 'Queue delays on chat during weekend, otherwise great.', rating: 4 },
  { id: 'r055', name: 'Noura K.', location: 'Dubai, AE', quote: 'Professional tone and careful verification. Impressed.', rating: 5 },
  { id: 'r056', name: 'Youssef A.', location: 'Cairo, EG', quote: 'Clear disclosures and precise confirmations.', rating: 5 },
  { id: 'r057', name: 'Fatima Z.', location: 'Riyadh, SA', quote: 'The process is strict, but that builds confidence.', rating: 5 },
  { id: 'r058', name: 'Hannah B.', location: 'Dublin, IE', quote: 'Documents reviewed quickly; deposits updated as promised.', rating: 5 },
  { id: 'r059', name: 'Luca T.', location: 'Milan, IT', quote: 'Serious approach and strong controls. Good results.', rating: 5 },
  { id: 'r060', name: 'Giulia F.', location: 'Rome, IT', quote: 'Had to wait for live chat once, but overall excellent.', rating: 4 },
  { id: 'r061', name: 'Marco R.', location: 'Turin, IT', quote: 'Manual approvals done on schedule. Smooth payout.', rating: 5 },
  { id: 'r062', name: 'Pierre L.', location: 'Paris, FR', quote: 'Très professionnel, clair et sécurisé.', rating: 5 },
  { id: 'r063', name: 'Nina D.', location: 'Lyon, FR', quote: 'Un peu d’attente au chat aux heures de pointe.', rating: 4 },
  { id: 'r064', name: 'Jules M.', location: 'Marseille, FR', quote: 'Plates-formes contrôlées, flux de retraits fiables.', rating: 5 },
  { id: 'r065', name: 'Peter V.', location: 'Amsterdam, NL', quote: 'Good balance of clarity and control; I like it.', rating: 5 },
  { id: 'r066', name: 'Eva S.', location: 'Rotterdam, NL', quote: 'Queue in chat occasionally, but final responses are thorough.', rating: 4 },
  { id: 'r067', name: 'Matej K.', location: 'Prague, CZ', quote: 'Solid risk disclosures and precise statements.', rating: 5 },
  { id: 'r068', name: 'Adam N.', location: 'Warsaw, PL', quote: 'Everything matched the documentation. Smooth handling.', rating: 5 },
  { id: 'r069', name: 'Elena P.', location: 'Madrid, ES', quote: 'Transparente y profesional. Muy recomendable.', rating: 5 },
  { id: 'r070', name: 'Javier R.', location: 'Barcelona, ES', quote: 'Algo de cola en el chat, el resto impecable.', rating: 4 },
  { id: 'r071', name: 'Andrei I.', location: 'Bucharest, RO', quote: 'Manual checks were detailed and helpful.', rating: 5 },
  { id: 'r072', name: 'Marta S.', location: 'Lisbon, PT', quote: 'Compliant and clearly communicated. Great.', rating: 5 },
  { id: 'r073', name: 'Stefan B.', location: 'Vienna, AT', quote: 'Clear KYC procedure and reliable approvals.', rating: 5 },
  { id: 'r074', name: 'Emma J.', location: 'Zurich, CH', quote: 'Very precise and predictable processes.', rating: 5 },
  { id: 'r075', name: 'Jon P.', location: 'Reykjavík, IS', quote: 'Strong documentation, serious approach. Pleased.', rating: 5 },
  { id: 'r076', name: 'Kaito M.', location: 'Tokyo, JP', quote: 'Careful review and trustworthy flow. Good system.', rating: 5 },
  { id: 'r077', name: 'Minji L.', location: 'Seoul, KR', quote: 'Well-run approvals and accurate reporting.', rating: 5 },
  { id: 'r078', name: 'Chen W.', location: 'Taipei, TW', quote: 'Queue existed once, but email reply was detailed.', rating: 4 },
  { id: 'r079', name: 'Dwi A.', location: 'Jakarta, ID', quote: 'Clear milestones and consistent payouts.', rating: 5 },
  { id: 'r080', name: 'Nguyen T.', location: 'Ho Chi Minh City, VN', quote: 'Everything worked as described in the docs.', rating: 5 },
  { id: 'r081', name: 'Thao P.', location: 'Hanoi, VN', quote: 'Live chat queue at peak time, otherwise responsive.', rating: 4 },
  { id: 'r082', name: 'Mohammad S.', location: 'Amman, JO', quote: 'Professional tone and responsible approvals.', rating: 5 },
  { id: 'r083', name: 'Leila M.', location: 'Casablanca, MA', quote: 'Secure and transparent. Good experience overall.', rating: 5 },
  { id: 'r084', name: 'Moses K.', location: 'Nairobi, KE', quote: 'The compliance steps were clear and timely.', rating: 5 },
  { id: 'r085', name: 'Tunde O.', location: 'Lagos, NG', quote: 'Queue on chat once; the case resolution was solid.', rating: 4 },
  { id: 'r086', name: 'Aisha B.', location: 'Abuja, NG', quote: 'Transparent fees and well-documented steps.', rating: 5 },
  { id: 'r087', name: 'Daniel A.', location: 'Accra, GH', quote: 'Reliable scheduling and verified payouts.', rating: 5 },
  { id: 'r088', name: 'Evelyn N.', location: 'Kampala, UG', quote: 'Manual review added confidence; results as expected.', rating: 5 },
  { id: 'r089', name: 'Yara F.', location: 'Doha, QA', quote: 'Very professional. Strong audit trail.', rating: 5 },
  { id: 'r090', name: 'Omar D.', location: 'Kuwait City, KW', quote: 'Comms were clear; approvals were punctual.', rating: 5 },
  { id: 'r091', name: 'Katerina V.', location: 'Athens, GR', quote: 'Stable operations and helpful documentation.', rating: 5 },
  { id: 'r092', name: 'Milan C.', location: 'Belgrade, RS', quote: 'Queue during peak hours, otherwise excellent staff.', rating: 4 },
  { id: 'r093', name: 'Ilija T.', location: 'Skopje, MK', quote: 'Thorough checks; payouts credited after approval.', rating: 5 },
  { id: 'r094', name: 'Arman H.', location: 'Yerevan, AM', quote: 'Accurate statements and precise returns tracking.', rating: 5 },
  { id: 'r095', name: 'Mariam G.', location: 'Tbilisi, GE', quote: 'Strong compliance culture and oversight.', rating: 5 },
  { id: 'r096', name: 'Rashid A.', location: 'Muscat, OM', quote: 'Chat queue existed once, email reply solved it.', rating: 4 },
  { id: 'r097', name: 'Sergio D.', location: 'San Juan, PR', quote: 'Secure rails and predictable turnarounds.', rating: 5 },
  { id: 'r098', name: 'Carla M.', location: 'San José, CR', quote: 'Everything matched the SLA; very professional.', rating: 5 },
  { id: 'r099', name: 'Bruno C.', location: 'São Paulo, BR', quote: 'Good oversight and reliable approvals.', rating: 5 },
  { id: 'r100', name: 'Isabela R.', location: 'Rio de Janeiro, BR', quote: 'Queue in live chat sometimes, overall better than before.', rating: 4 },
];

function Stars({ n }: { n: number }) {
  const items = Array.from({ length: 5 }, (_, i) => i < n);
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {items.map((filled, i) => (
        <svg
          key={i}
          className={filled ? 'w-4 h-4 text-yellow-400' : 'w-4 h-4 text-gray-300'}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsRotator({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFade(true); // Always show first review immediately
    timer.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % REVIEWS.length);
        setFade(true);
      }, 250);
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [intervalMs]);

  // Defensive: If idx is out of bounds, reset to 0
  const r = REVIEWS[idx] || REVIEWS[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        <div className="flex items-center justify-between mb-2">
          <Stars n={r.rating} />
          <span className="text-xs text-gray-500">Auto-rotating reviews</span>
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">“{r.quote}”</p>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold text-[#0b2f6b]">{r.name}</span>
          <span className="mx-2">•</span>
          <span>{r.location}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {REVIEWS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#0b2f6b]' : 'w-2 bg-gray-300'}`}
            aria-label={i === idx ? 'current review' : 'review'}
          />
        ))}
      </div>
    </div>
  );
}
