import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership — WolvCapital",
  description:
    "Meet the leadership behind WolvCapital. Learn about the Founder & CEO, our values, and how we manage product, security and compliance.",
};

type Leader = {
  id: string;
  name: string;
  title: string;
  bio: string;
  initials?: string;
};

const leaders: Leader[] = [
  {
    id: "ceo",
    name: "Ozoani Nnabuike Philip",
    title: "Founder & CEO",
    bio:
      "Ozoani Nnabuike Philip leads WolvCapital with a focus on transparency, secure operations and disciplined investment product design. With hands-on experience in building online platforms and a practical approach to risk management, Philip drives the product roadmap and compliance posture of the business.",
    initials: "OP",
  },
  // Add additional leaders/advisors here when available
];

export default function LeadershipPage(): JSX.Element {
  return (
    <main className="min-h-screen py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-semibold mb-4">Leadership</h1>
        <p className="text-gray-700 mb-6">
          Meet the team guiding WolvCapital’s product direction, security practices, and investor protections.
        </p>

        <section className="space-y-6">
          {leaders.map((leader) => (
            <div key={leader.id} className="flex items-start space-x-6">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600">
                {leader.initials ?? leader.name.split(" ").map(n => n[0]).slice(0,2).join("")}
              </div>

              <div>
                <h2 className="text-xl font-medium">{leader.name}</h2>
                <p className="text-indigo-600 font-medium mt-1">{leader.title}</p>
                <p className="text-gray-600 mt-3">{leader.bio}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium">Values & Vision</h3>
          <p className="text-gray-600 mt-2">
            Under our leadership we prioritize clear communication, practical security, and a measured approach to returns.
            Our goal is to build a platform that is understandable, accountable and focused on protecting investor capital.
          </p>

          <div className="mt-6">
            <a className="inline-block bg-indigo-600 text-white px-4 py-2 rounded" href="/about">
              Learn more about WolvCapital
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
