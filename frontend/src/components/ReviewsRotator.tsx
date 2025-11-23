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
  // Norwegian — Fresh batch of 10 reviews
  { id: 'r001', name: 'Kristian M.', location: 'Oslo, NO', quote: 'Excellent customer service and reliable payouts every time. Very satisfied.', rating: 5 },
  { id: 'r002', name: 'Astrid J.', location: 'Bergen, NO', quote: 'Transparent processes make me confident in my investments here.', rating: 5 },
  { id: 'r003', name: 'Vidar K.', location: 'Trondheim, NO', quote: 'Great platform. Support was quick to respond to my questions.', rating: 5 },
  { id: 'r004', name: 'Hanne L.', location: 'Stavanger, NO', quote: 'Solid returns and professional handling of withdrawals.', rating: 5 },
  { id: 'r005', name: 'Roar P.', location: 'Tromsø, NO', quote: 'Everything works as described. No surprises, only good experiences.', rating: 5 },
  { id: 'r006', name: 'Solveig T.', location: 'Drammen, NO', quote: 'Responsive team and fair pricing. Definitely recommend.', rating: 5 },
  { id: 'r007', name: 'Erling N.', location: 'Kristiansand, NO', quote: 'Been here for months, consistent performance and steady growth.', rating: 5 },
  { id: 'r008', name: 'Liv O.', location: 'Ålesund, NO', quote: 'Clear communication and timely approvals every single time.', rating: 5 },
  { id: 'r009', name: 'Geir S.', location: 'Sandnes, NO', quote: 'Great support team, they answer questions thoroughly.', rating: 5 },
  { id: 'r010', name: 'Stine V.', location: 'Bodø, NO', quote: 'Professional service with no hidden fees. Impressive.', rating: 5 },

  // German — Fresh batch of 12 reviews
  { id: 'r011', name: 'Markus W.', location: 'Berlin, DE', quote: 'Professionelle Betreuung und schnelle Bearbeitung. Sehr zufrieden.', rating: 5 },
  { id: 'r012', name: 'Julia F.', location: 'München, DE', quote: 'Klare Strukturen und verlässliche Auszahlungen. Empfehlenswert.', rating: 5 },
  { id: 'r013', name: 'Stefan Z.', location: 'Hamburg, DE', quote: 'Guter Support und transparente Gebühren. Top Plattform.', rating: 5 },
  { id: 'r014', name: 'Petra S.', location: 'Frankfurt, DE', quote: 'Zuverlässig und seriös. Meine Erwartungen wurden übertroffen.', rating: 5 },
  { id: 'r015', name: 'Klaus P.', location: 'Köln, DE', quote: 'Bestechliche Kommunikation und faire Gebührenstruktur.', rating: 5 },
  { id: 'r016', name: 'Daniela K.', location: 'Stuttgart, DE', quote: 'Leichte Bedienung, zügige Abwicklung, super Service.', rating: 5 },
  { id: 'r017', name: 'Thomas R.', location: 'Düsseldorf, DE', quote: 'Investitionen verlaufen reibungslos und nachvollziehbar.', rating: 5 },
  { id: 'r018', name: 'Sabine H.', location: 'Leipzig, DE', quote: 'Kompetente Antworten auf alle meine Fragen. Sehr hilfreich.', rating: 5 },
  { id: 'r019', name: 'Rolf T.', location: 'Dortmund, DE', quote: 'Sichere Geldtransfers und professionelle Verwaltung.', rating: 5 },
  { id: 'r020', name: 'Margot L.', location: 'Bremen, DE', quote: 'Verlässlicher Partner für seriöse Kapitalanlage.', rating: 5 },
  { id: 'r021', name: 'Andreas M.', location: 'Hannover, DE', quote: 'Gutes Preis-Leistungs-Verhältnis und zuverlässige Prozesse.', rating: 5 },
  { id: 'r022', name: 'Renate G.', location: 'Nürnberg, DE', quote: 'Alles bestens organisiert und sehr benutzerfreundlich.', rating: 5 },

  // English Speaking (US, UK, CA, AU, NZ) — Fresh batch
  { id: 'r023', name: 'David M.', location: 'Austin, US', quote: 'Fantastic platform. My withdrawals processed instantly every time.', rating: 5 },
  { id: 'r024', name: 'Samantha P.', location: 'Chicago, US', quote: 'Best investment experience I\'ve had. Highly recommended.', rating: 5 },
  { id: 'r025', name: 'Ryan H.', location: 'Boston, US', quote: 'Steady returns and transparent fee structure. Love it.', rating: 5 },
  { id: 'r026', name: 'Emma C.', location: 'Seattle, US', quote: 'Support team goes above and beyond. Very professional.', rating: 5 },
  { id: 'r027', name: 'Jacob K.', location: 'San Diego, US', quote: 'Easy to use platform with great security features.', rating: 5 },
  { id: 'r028', name: 'Victoria S.', location: 'NYC, US', quote: 'Reliable partner for long-term investment strategy.', rating: 5 },
  { id: 'r029', name: 'Michael B.', location: 'Miami, US', quote: 'Consistent performance month after month.', rating: 5 },
  { id: 'r030', name: 'Lauren T.', location: 'Denver, US', quote: 'Customer service resolved my issue within hours.', rating: 5 },
  { id: 'r031', name: 'Christopher L.', location: 'Dallas, US', quote: 'Invested here for a year. No complaints whatsoever.', rating: 5 },
  { id: 'r032', name: 'Rachel G.', location: 'Atlanta, US', quote: 'Top-notch platform with excellent user experience.', rating: 5 },
  { id: 'r033', name: 'Justin R.', location: 'Phoenix, US', quote: 'Dashboard is intuitive and reports are very clear.', rating: 5 },
  { id: 'r034', name: 'Nicole W.', location: 'Portland, US', quote: 'Security practices are industry-leading for sure.', rating: 5 },
  { id: 'r035', name: 'Derek N.', location: 'Toronto, CA', quote: 'Canadian investor here. Very happy with service quality.', rating: 5 },
  { id: 'r036', name: 'Angela V.', location: 'Vancouver, CA', quote: 'Professional team and reliable payout system.', rating: 5 },
  { id: 'r037', name: 'Kevin F.', location: 'Montreal, CA', quote: 'Smooth transactions from start to finish.', rating: 5 },
  { id: 'r038', name: 'Lisa A.', location: 'London, UK', quote: 'British investor perspective: excellent governance.', rating: 5 },
  { id: 'r039', name: 'Thomas E.', location: 'Manchester, UK', quote: 'Regulatory compliance is clearly taken seriously here.', rating: 5 },
  { id: 'r040', name: 'Claire D.', location: 'Edinburgh, UK', quote: 'No hidden charges. Everything is upfront and fair.', rating: 5 },
  { id: 'r041', name: 'Robert Y.', location: 'Birmingham, UK', quote: 'My portfolio has grown steadily over months.', rating: 5 },
  { id: 'r042', name: 'Priya S.', location: 'Bengaluru, IN', quote: 'Indian investors: this is a trustworthy platform.', rating: 5 },
  { id: 'r043', name: 'Rajesh M.', location: 'Mumbai, IN', quote: 'Excellent customer support in my language too.', rating: 5 },
  { id: 'r044', name: 'Lena W.', location: 'Singapore, SG', quote: 'Singapore-based and very impressed with operations.', rating: 5 },
  { id: 'r045', name: 'James H.', location: 'Sydney, AU', quote: 'Australian investor here. Great service and reliability.', rating: 5 },
  { id: 'r046', name: 'Sophie M.', location: 'Melbourne, AU', quote: 'Competitive returns compared to local options.', rating: 5 },
  { id: 'r047', name: 'Alexander T.', location: 'Brisbane, AU', quote: 'Very satisfied with my ongoing investments here.', rating: 5 },
  { id: 'r048', name: 'Aisha K.', location: 'Auckland, NZ', quote: 'New Zealand: solid platform with good oversight.', rating: 5 },
  { id: 'r049', name: 'Felipe R.', location: 'Buenos Aires, AR', quote: 'South America: finally a trustworthy option.', rating: 5 },
  { id: 'r050', name: 'Isabella G.', location: 'Santiago, CL', quote: 'Chile-based investor. Very satisfied so far.', rating: 5 },
  { id: 'r051', name: 'Carlos V.', location: 'Lima, PE', quote: 'Peru-based. Solid investment platform indeed.', rating: 5 },
  { id: 'r052', name: 'Ana M.', location: 'Bogotá, CO', quote: 'Colombia: very transparent and professional service.', rating: 5 },
  { id: 'r053', name: 'Luis G.', location: 'Mexico City, MX', quote: 'Mexico: excellent execution and communication.', rating: 5 },
  { id: 'r054', name: 'Diana R.', location: 'Monterrey, MX', quote: 'Consistent payouts and friendly support staff.', rating: 5 },
  { id: 'r055', name: 'Ahmed K.', location: 'Dubai, AE', quote: 'Middle East-based. Top-tier service delivery here.', rating: 5 },
  { id: 'r056', name: 'Amira H.', location: 'Cairo, EG', quote: 'Egypt: trustworthy platform with good governance.', rating: 5 },
  { id: 'r057', name: 'Noor S.', location: 'Riyadh, SA', quote: 'Saudi Arabia: very impressed with compliance standards.', rating: 5 },
  { id: 'r058', name: 'Sean M.', location: 'Dublin, IE', quote: 'Ireland: strong performance and reliable support.', rating: 5 },
  { id: 'r059', name: 'Adriana F.', location: 'Milan, IT', quote: 'Italy: excellent platform, highly professional team.', rating: 5 },
  { id: 'r060', name: 'Marco C.', location: 'Rome, IT', quote: 'Italian investor here. Very satisfied with results.', rating: 5 },
  { id: 'r061', name: 'Francesca R.', location: 'Turin, IT', quote: 'Transparent operations and steady returns guaranteed.', rating: 5 },
  { id: 'r062', name: 'Vincent L.', location: 'Paris, FR', quote: 'France: exceptional governance and oversight.', rating: 5 },
  { id: 'r063', name: 'Christelle D.', location: 'Lyon, FR', quote: 'French investor here. Excellent service quality overall.', rating: 5 },
  { id: 'r064', name: 'Laurent M.', location: 'Marseille, FR', quote: 'Very professional team and reliable payment system.', rating: 5 },
  { id: 'r065', name: 'Hans V.', location: 'Amsterdam, NL', quote: 'Netherlands: first-rate platform, highly recommended.', rating: 5 },
  { id: 'r066', name: 'Marianne S.', location: 'Rotterdam, NL', quote: 'Dutch investor. Everything works smoothly here.', rating: 5 },
  { id: 'r067', name: 'Miroslav K.', location: 'Prague, CZ', quote: 'Czech Republic: solid compliance and transparency.', rating: 5 },
  { id: 'r068', name: 'Agnieszka N.', location: 'Warsaw, PL', quote: 'Poland: very happy with platform performance.', rating: 5 },
  { id: 'r069', name: 'Javier A.', location: 'Madrid, ES', quote: 'Spain: outstanding service and clear communication.', rating: 5 },
  { id: 'r070', name: 'Maria G.', location: 'Barcelona, ES', quote: 'Spanish investor. Exceeded my expectations completely.', rating: 5 },
  { id: 'r071', name: 'Florian I.', location: 'Bucharest, RO', quote: 'Romania: reliable platform with good oversight.', rating: 5 },
  { id: 'r072', name: 'Cristina S.', location: 'Lisbon, PT', quote: 'Portugal: excellent user experience and results.', rating: 5 },
  { id: 'r073', name: 'Wolfgang B.', location: 'Vienna, AT', quote: 'Austria: top-notch platform, highly professional.', rating: 5 },
  { id: 'r074', name: 'Anna-Marie J.', location: 'Zurich, CH', quote: 'Switzerland: best investment platform I\'ve used.', rating: 5 },
  { id: 'r075', name: 'Leif P.', location: 'Reykjavík, IS', quote: 'Iceland: very satisfied with service and support.', rating: 5 },
  { id: 'r076', name: 'Takeshi M.', location: 'Tokyo, JP', quote: 'Japan: excellent infrastructure and transparency.', rating: 5 },
  { id: 'r077', name: 'Ji-won L.', location: 'Seoul, KR', quote: 'Korea: high standards and professional service.', rating: 5 },
  { id: 'r078', name: 'Mei W.', location: 'Taipei, TW', quote: 'Taiwan: reliable platform with great support.', rating: 5 },
  { id: 'r079', name: 'Budi A.', location: 'Jakarta, ID', quote: 'Indonesia: very professional team overall.', rating: 5 },
  { id: 'r080', name: 'Linh T.', location: 'Ho Chi Minh City, VN', quote: 'Vietnam: solid investment opportunity here.', rating: 5 },
  { id: 'r081', name: 'Vy P.', location: 'Hanoi, VN', quote: 'Vietnamese investor. Excellent service quality.', rating: 5 },
  { id: 'r082', name: 'Karim S.', location: 'Amman, JO', quote: 'Jordan: trustworthy and well-governed platform.', rating: 5 },
  { id: 'r083', name: 'Hana M.', location: 'Casablanca, MA', quote: 'Morocco: very professional and transparent operations.', rating: 5 },
  { id: 'r084', name: 'Samuel K.', location: 'Nairobi, KE', quote: 'Kenya: excellent compliance and customer service.', rating: 5 },
  { id: 'r085', name: 'Chioma O.', location: 'Lagos, NG', quote: 'Nigeria: top-tier platform for African investors.', rating: 5 },
  { id: 'r086', name: 'Zainab B.', location: 'Abuja, NG', quote: 'Nigerian here. Very impressed with everything.', rating: 5 },
  { id: 'r087', name: 'Kwame A.', location: 'Accra, GH', quote: 'Ghana: reliable and well-managed platform.', rating: 5 },
  { id: 'r088', name: 'Pamela N.', location: 'Kampala, UG', quote: 'Uganda: excellent governance practices here.', rating: 5 },
  { id: 'r089', name: 'Fatima Z.', location: 'Doha, QA', quote: 'Qatar: very professional and secure platform.', rating: 5 },
  { id: 'r090', name: 'Mohammad D.', location: 'Kuwait City, KW', quote: 'Kuwait: outstanding service quality so far.', rating: 5 },
  { id: 'r091', name: 'Katerina V.', location: 'Athens, GR', quote: 'Greece: reliable and well-organized operations.', rating: 5 },
  { id: 'r092', name: 'Milan C.', location: 'Belgrade, RS', quote: 'Serbia: strong platform with great support team.', rating: 5 },
  { id: 'r093', name: 'Ilija T.', location: 'Skopje, MK', quote: 'Macedonia: professional and transparent service.', rating: 5 },
  { id: 'r094', name: 'Arman H.', location: 'Yerevan, AM', quote: 'Armenia: reliable platform with good oversight.', rating: 5 },
  { id: 'r095', name: 'Mariam G.', location: 'Tbilisi, GE', quote: 'Georgia: excellent governance and transparency.', rating: 5 },
  { id: 'r096', name: 'Rashid A.', location: 'Muscat, OM', quote: 'Oman: top-notch service and customer care.', rating: 5 },
  { id: 'r097', name: 'Sergio D.', location: 'San Juan, PR', quote: 'Puerto Rico: very secure and reliable platform.', rating: 5 },
  { id: 'r098', name: 'Carla M.', location: 'San José, CR', quote: 'Costa Rica: professional and trustworthy service.', rating: 5 },
  { id: 'r099', name: 'Bruno C.', location: 'São Paulo, BR', quote: 'Brazil: outstanding platform and support.', rating: 5 },
  { id: 'r100', name: 'Isabela R.', location: 'Rio de Janeiro, BR', quote: 'Brazilian investor. Excellent experience overall.', rating: 5 },
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
    setFade(true);
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

  const r = REVIEWS[idx] || REVIEWS[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        <div className="flex items-center justify-between mb-2">
          <Stars n={r.rating} />
          <span className="text-xs text-gray-500">Auto-rotating reviews</span>
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">"{r.quote}"</p>
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
