import type { FormData, GeneratedContent } from "./sessions";

const mockByType: Record<string, Partial<GeneratedContent>> = {
  Restaurant: {
    heroHeadline: "Where every meal becomes a memory",
    heroSubline: "Authentic flavours crafted with passion, served in a warm and welcoming atmosphere.",
    aboutTitle: "Our story",
    aboutText:
      "Born from a love of food and community, we opened our doors with one simple goal: to make every guest feel at home.\n\nOur chefs source the finest local ingredients each morning, turning them into dishes that surprise and delight.\n\nWhether you're joining us for a quick lunch or a long dinner, we promise an experience worth returning for.",
    services: [
      { title: "Dine In", description: "Relax in our cosy dining room and let us take care of everything." },
      { title: "Takeaway", description: "Your favourite dishes, packed with care and ready to enjoy anywhere." },
      { title: "Private Events", description: "Celebrate your special moments with a personalised menu and dedicated service." },
    ],
    testimonials: [
      { name: "Sophie L.", role: "Regular guest", text: "The food is incredible every single time. I bring all my friends here.", rating: 5 },
      { name: "Marc T.", role: "Food blogger", text: "Genuinely one of the best meals I've had this year. Don't miss it.", rating: 5 },
      { name: "Elena R.", role: "Local resident", text: "Perfect spot for a family dinner. Warm atmosphere and delicious food.", rating: 5 },
    ],
    ctaText: "Reserve a table",
  },

  Agency: {
    heroHeadline: "Digital experiences that convert",
    heroSubline: "We design and build digital products that grow your business — beautifully.",
    aboutTitle: "We build what matters",
    aboutText:
      "We're a boutique digital agency obsessed with results. Every project we take on starts with a deep understanding of your business, your customers, and your goals.\n\nOur team combines sharp design thinking with solid engineering to deliver products that look great and perform even better.\n\nFrom early-stage startups to established brands, we've helped dozens of companies find their digital edge.",
    services: [
      { title: "Web Design", description: "Conversion-focused interfaces crafted pixel by pixel for your audience." },
      { title: "Development", description: "Fast, secure, and scalable web applications built with modern tech." },
      { title: "SEO & Growth", description: "Data-driven strategies to grow your organic traffic and leads." },
    ],
    testimonials: [
      { name: "James K.", role: "CEO, TechStart", text: "They delivered our MVP in record time. The quality was outstanding.", rating: 5 },
      { name: "Camille D.", role: "Marketing Director", text: "Our conversion rate doubled after the redesign. Highly recommend.", rating: 5 },
      { name: "Alex M.", role: "Founder, SaaS Co.", text: "Professional, responsive, and incredibly talented team.", rating: 5 },
    ],
    ctaText: "Start a project",
  },

  SaaS: {
    heroHeadline: "From idea to insight in minutes",
    heroSubline: "The all-in-one platform your team has been waiting for.",
    aboutTitle: "Built for teams who move fast",
    aboutText:
      "We built this platform because we were tired of duct-taping five tools together to get one job done. Our mission is radical simplicity — one place, every workflow, zero friction.\n\nTrusted by over 2,000 teams across 40 countries, our platform handles the complexity so your team can focus on what actually matters.\n\nFrom onboarding to enterprise, we scale with you.",
    services: [
      { title: "Automated Workflows", description: "Build and deploy complex automations without writing a single line of code." },
      { title: "Real-time Analytics", description: "Dashboards that surface the metrics that move your business forward." },
      { title: "Team Collaboration", description: "Comments, assignments, and notifications that keep everyone aligned." },
    ],
    testimonials: [
      { name: "David R.", role: "Head of Ops, Fintech Co.", text: "We replaced three tools with this. Saved us 12 hours a week.", rating: 5 },
      { name: "Priya S.", role: "Product Lead", text: "The analytics alone are worth the subscription. Incredible depth.", rating: 5 },
      { name: "Lucas B.", role: "Founder", text: "Onboarded in 20 minutes. The UX is just exceptional.", rating: 5 },
    ],
    ctaText: "Start free trial",
  },

  Startup: {
    heroHeadline: "We're changing how the world works",
    heroSubline: "Join thousands of early adopters already on the waitlist. Be first when we launch.",
    aboutTitle: "Why we're building this",
    aboutText:
      "The status quo is broken. We saw it every day — smart people spending hours on tasks that should take seconds. So we decided to fix it.\n\nOur founding team brings decades of experience from leading tech companies and a single-minded obsession with making work feel effortless.\n\nWe're pre-launch and already backed by top-tier investors. The future is closer than you think.",
    services: [
      { title: "Early Access", description: "Be among the first to use the platform and shape its direction with your feedback." },
      { title: "Founding Member Pricing", description: "Lock in lifetime discounted rates available only before our public launch." },
      { title: "Dedicated Onboarding", description: "White-glove setup and onboarding for every founding member, no exceptions." },
    ],
    testimonials: [
      { name: "Yasmin O.", role: "Beta tester", text: "I've tried every tool in this space. This is the one I've been waiting for.", rating: 5 },
      { name: "Théo V.", role: "Early access user", text: "The team is responsive, the product is brilliant, and it keeps getting better.", rating: 5 },
      { name: "Sara H.", role: "Founding member", text: "Jumped on the waitlist the day I heard about it. Best decision I've made.", rating: 5 },
    ],
    ctaText: "Join the waitlist",
  },

  Coach: {
    heroHeadline: "Your breakthrough starts here",
    heroSubline: "Personalized coaching that transforms how you think, lead, and live.",
    aboutTitle: "My approach",
    aboutText:
      "Coaching changed my life before I became a coach. I know what it feels like to be stuck — talented, motivated, but not moving. That's exactly who I built my practice for.\n\nOver the past decade I've worked with executives, entrepreneurs, and high performers across every industry. My approach blends evidence-based psychology with practical strategy that actually sticks.\n\nI don't believe in one-size-fits-all. Every engagement is built around you, your goals, and your timeline.",
    services: [
      { title: "1:1 Coaching", description: "Intensive, personalised sessions focused on your specific goals and blind spots." },
      { title: "Group Masterminds", description: "Curated peer groups that challenge and accelerate your growth together." },
      { title: "Online Programmes", description: "Self-paced courses packed with frameworks I've refined over 10+ years." },
    ],
    testimonials: [
      { name: "Nadia F.", role: "VP of Marketing", text: "Six months in and I've been promoted, hired a team, and feel more confident than ever.", rating: 5 },
      { name: "Romain C.", role: "Entrepreneur", text: "The clarity I got in just three sessions was worth more than a year of therapy.", rating: 5 },
      { name: "Lena W.", role: "Executive Coach", text: "I came to learn. I left transformed. The best investment I've made in myself.", rating: 5 },
    ],
    ctaText: "Book a discovery call",
  },

  Consultant: {
    heroHeadline: "The expertise you need, the results you deserve",
    heroSubline: "Strategic consulting that cuts through complexity and delivers measurable impact.",
    aboutTitle: "Why clients choose us",
    aboutText:
      "We don't do vague recommendations and thick reports no one reads. We embed with your team, identify the real constraints, and execute alongside you until the problem is solved.\n\nOur consultants have led major transformations across finance, operations, and technology in companies ranging from Series A startups to global enterprises.\n\nEvery engagement is scoped for impact — not hours billed.",
    services: [
      { title: "Strategic Advisory", description: "C-suite counsel on growth strategy, market entry, and competitive positioning." },
      { title: "Operational Excellence", description: "Process redesign and team enablement that drives efficiency at scale." },
      { title: "Digital Transformation", description: "Technology strategy and implementation that modernises how you operate." },
    ],
    testimonials: [
      { name: "Henri B.", role: "CEO, Manufacturing Group", text: "They found €2M in operational savings in the first month. Extraordinary work.", rating: 5 },
      { name: "Claire M.", role: "CFO", text: "The quality of thinking and execution was unlike any consultant I've worked with.", rating: 5 },
      { name: "Karim A.", role: "COO, Retail Chain", text: "They became part of the team. The results speak for themselves.", rating: 5 },
    ],
    ctaText: "Request a consultation",
  },

  Fitness: {
    heroHeadline: "Transform your body, transform your life",
    heroSubline: "Expert coaching, proven programming, and a community that pushes you further.",
    aboutTitle: "Training that actually works",
    aboutText:
      "Most people try hard and see little progress because they're following the wrong plan. We've spent years perfecting programming that delivers results regardless of your starting point.\n\nOur coaches are certified professionals who care as much about your mindset as your reps. Progress here is never just physical.\n\nFrom first-timers to competitive athletes, we've built a place where everyone belongs and everyone grows.",
    services: [
      { title: "Personal Training", description: "One-on-one sessions tailored to your goals, schedule, and fitness level." },
      { title: "Group Classes", description: "High-energy sessions that make training fun, social, and seriously effective." },
      { title: "Nutrition Coaching", description: "Meal plans and lifestyle guidance that fuel your results inside and outside the gym." },
    ],
    testimonials: [
      { name: "Jess T.", role: "Member since 2023", text: "I lost 18kg and found confidence I didn't know I had. This place changed everything.", rating: 5 },
      { name: "Omar K.", role: "Amateur athlete", text: "The programming is elite. My performance has never been this consistent.", rating: 5 },
      { name: "Mia R.", role: "New member", text: "Walked in nervous, walked out motivated. The coaches are world-class.", rating: 5 },
    ],
    ctaText: "Start your free week",
  },

  Healthcare: {
    heroHeadline: "Your health, our commitment",
    heroSubline: "Compassionate, evidence-based care that puts you at the centre of every decision.",
    aboutTitle: "A practice built on trust",
    aboutText:
      "Medicine should feel human. We built this practice around the belief that exceptional care comes from listening first and treating second.\n\nOur team of accredited specialists brings decades of combined clinical experience across a broad range of disciplines. We invest in the latest diagnostic tools so our assessments are thorough and our treatments targeted.\n\nEvery patient relationship is long-term. We track your progress, adapt your care, and are always reachable when you need us.",
    services: [
      { title: "General Practice", description: "Comprehensive primary care for individuals and families, from prevention to treatment." },
      { title: "Specialist Referrals", description: "Coordinated access to trusted specialists across all major disciplines." },
      { title: "Preventive Health", description: "Screenings, lifestyle programmes, and health plans designed to keep you well." },
    ],
    testimonials: [
      { name: "Fatima L.", role: "Patient", text: "For the first time, I feel truly heard by my doctor. The care here is exceptional.", rating: 5 },
      { name: "Bernard O.", role: "Regular patient", text: "Thorough, prompt, and genuinely invested in my wellbeing. Wouldn't go anywhere else.", rating: 5 },
      { name: "Ingrid H.", role: "Patient", text: "The diagnostic process was incredibly reassuring. I left with answers and a clear plan.", rating: 5 },
    ],
    ctaText: "Book an appointment",
  },

  RealEstate: {
    heroHeadline: "Find the place you'll call home",
    heroSubline: "Expert guidance and an exceptional portfolio of properties across the city's best neighbourhoods.",
    aboutTitle: "Your local property experts",
    aboutText:
      "Real estate is one of the biggest decisions of your life. You deserve an agent who treats it that way.\n\nWith over 15 years in the local market, we've matched hundreds of buyers and sellers with exactly the right outcome — on time, on budget, and without the stress.\n\nFrom first apartments to luxury estates, our portfolio is curated and our process is transparent from offer to keys.",
    services: [
      { title: "Residential Sales", description: "Expert pricing, targeted marketing, and expert negotiation for every listing." },
      { title: "Buyer Representation", description: "We find properties that match your brief before they hit the public market." },
      { title: "Property Valuation", description: "Accurate, free appraisals based on real data and deep local knowledge." },
    ],
    testimonials: [
      { name: "Pierre & Julie M.", role: "First-time buyers", text: "We found our dream apartment in three weeks. The whole process was seamless.", rating: 5 },
      { name: "Nathalie B.", role: "Seller", text: "Listed on Tuesday, sold above asking on Friday. Unbelievable service.", rating: 5 },
      { name: "Victor S.", role: "Property investor", text: "I trust them completely. Every deal they've sourced has outperformed.", rating: 5 },
    ],
    ctaText: "View properties",
  },

  Hotel: {
    heroHeadline: "Where every stay becomes a story",
    heroSubline: "Beautifully appointed rooms, impeccable service, and a location you'll want to return to.",
    aboutTitle: "A place apart",
    aboutText:
      "We didn't want to create another hotel. We wanted to create a feeling — the feeling of arriving somewhere that was made just for you.\n\nEvery room is individually designed with local artisans and premium materials. Our team is trained not just to assist, but to anticipate.\n\nWhether you're here for a night or a week, business or pure indulgence, we'll make sure it's unforgettable.",
    services: [
      { title: "Luxury Rooms & Suites", description: "Individually styled spaces with curated amenities and exceptional comfort." },
      { title: "Dining Experience", description: "A seasonal menu celebrating local produce, available morning through evening." },
      { title: "Concierge Services", description: "Bespoke itineraries, reservations, and local expertise at your fingertips." },
    ],
    testimonials: [
      { name: "Laura & Paul T.", role: "Anniversary stay", text: "The most romantic experience we've ever had. Every detail was perfect.", rating: 5 },
      { name: "Michael O.", role: "Business traveller", text: "This is my new home when I'm in the city. The service is flawless.", rating: 5 },
      { name: "Chloé D.", role: "Weekend escape", text: "I didn't want to leave. It felt like a private home, but better.", rating: 5 },
    ],
    ctaText: "Check availability",
  },

  Event: {
    heroHeadline: "An experience you won't forget",
    heroSubline: "Bringing together the best minds and biggest ideas for two unforgettable days.",
    aboutTitle: "Why this event matters",
    aboutText:
      "Every great shift in an industry starts with the right conversation in the right room. We built this event to be that room.\n\nOur programme is curated end-to-end — no filler talks, no sponsor pitches disguised as sessions. Every speaker is a practitioner with something real to say.\n\nFrom the opening keynote to the closing dinner, every moment is designed to spark ideas you'll still be thinking about six months later.",
    services: [
      { title: "Keynote Sessions", description: "World-class speakers sharing bold ideas and hard-won lessons from the field." },
      { title: "Workshops", description: "Hands-on, small-group sessions that turn insights into actionable skills." },
      { title: "Networking Events", description: "Curated spaces and structured formats that make meaningful connections easy." },
    ],
    testimonials: [
      { name: "Amara D.", role: "Attendee 2024", text: "The most valuable two days I've spent professionally. I'll be back every year.", rating: 5 },
      { name: "Sven H.", role: "Speaker", text: "A perfectly organised event with an audience that's genuinely engaged.", rating: 5 },
      { name: "Ines F.", role: "Sponsor", text: "The ROI on our involvement was immediately apparent. Quality crowd.", rating: 5 },
    ],
    ctaText: "Get your ticket",
  },

  NonProfit: {
    heroHeadline: "Together we can change what matters",
    heroSubline: "Every donation, every hour, every share — it all adds up to something real.",
    aboutTitle: "Why we exist",
    aboutText:
      "The problems we work on don't have simple solutions. But we've learned that sustained, focused effort — backed by a community that cares — can move mountains.\n\nFounded in 2015, our organisation has delivered measurable impact across three continents, in partnership with communities, governments, and the private sector.\n\nWe operate with radical transparency. You can always see exactly where your contribution goes and what it achieves.",
    services: [
      { title: "Community Programmes", description: "Direct on-the-ground support for the communities and causes we serve." },
      { title: "Advocacy & Policy", description: "Systemic change efforts that address root causes, not just symptoms." },
      { title: "Education Initiatives", description: "Skills, knowledge, and opportunity for those who need it most." },
    ],
    testimonials: [
      { name: "Fatou K.", role: "Programme participant", text: "They gave me more than support — they gave me a future I couldn't have imagined.", rating: 5 },
      { name: "Dr. Ahmed R.", role: "Partner organisation", text: "Rigorous, compassionate, and genuinely effective. A model for the sector.", rating: 5 },
      { name: "Elise M.", role: "Monthly donor", text: "I've donated to many causes. This is the one where I truly see the impact.", rating: 5 },
    ],
    ctaText: "Donate now",
  },

  Luxury: {
    heroHeadline: "Crafted for those who know the difference",
    heroSubline: "Each piece a testament to artisanal mastery — jewellery that carries meaning across generations.",
    aboutTitle: "The Maison",
    aboutText:
      "Maison Aurore was founded in Paris in 1987 by master goldsmith Hélène Aurore, who believed that a jewel should carry more than brilliance — it should carry memory.\n\nEvery piece in our collection is handcrafted in our atelier in the 1st arrondissement, using only ethically sourced gemstones and 18-karat gold. Our artisans train for years before touching a finished piece.\n\nWe create for those who understand that true luxury is not about display, but about substance — the weight of gold, the clarity of a stone, the permanence of beauty.",
    services: [
      { title: "Haute Joaillerie", description: "Bespoke commissioned pieces, crafted over months, made to be worn for decades." },
      { title: "Bridal Collection", description: "Engagement rings and wedding bands designed to tell your unique love story." },
      { title: "Private Atelier", description: "Book a private consultation with our master jewellers by appointment only." },
    ],
    testimonials: [
      { name: "Isabelle de V.", role: "Client since 2015", text: "My ring is perfection. They understood exactly what I wanted before I could articulate it.", rating: 5 },
      { name: "Charlotte M.", role: "Bride, 2024", text: "The most beautiful object I have ever worn. Every detail is extraordinary.", rating: 5 },
      { name: "Édouard L.", role: "Collector", text: "Maison Aurore creates heirlooms. That is rare, and it is everything.", rating: 5 },
    ],
    ctaText: "Book a private appointment",
  },

  Brutalist: {
    heroHeadline: "FORM FOLLOWS FORCE",
    heroSubline: "Architecture without compromise. Spaces that confront, challenge, and endure.",
    aboutTitle: "Studio FORM",
    aboutText:
      "We don't design for comfort. We design for truth.\n\nFORM is an architecture studio that refuses decoration in favour of intention. Every material is chosen for honesty. Every line exists because it must. We have built museums, residences, and civic spaces that define the conversation around contemporary architecture.\n\nIf you want beauty through simplicity and power through restraint — you've come to the right place.",
    services: [
      { title: "Residential Architecture", description: "Private homes of radical clarity — spaces that feel inevitable once built." },
      { title: "Cultural Spaces", description: "Museums, galleries, and civic buildings that frame culture with authority." },
      { title: "Urban Planning", description: "Neighbourhood-scale projects that reshape how people move, gather, and live." },
    ],
    testimonials: [
      { name: "Rolf H.", role: "Private client", text: "FORM built me a house I'm still discovering. It makes me think differently every day.", rating: 5 },
      { name: "The Oslo Museum", role: "Cultural institution", text: "A building that became part of the conversation it was meant to house.", rating: 5 },
      { name: "Petra S.", role: "Urban developer", text: "Uncompromising in all the right ways. The results stand for themselves.", rating: 5 },
    ],
    ctaText: "Discuss your project",
  },

  Magazine: {
    heroHeadline: "Ideas worth following",
    heroSubline: "Meridian covers the intersections: culture, technology, politics, and the future being built right now.",
    aboutTitle: "About Meridian",
    aboutText:
      "Meridian was founded on the belief that long-form journalism still matters — perhaps more than ever.\n\nIn a world of hot takes and algorithmic noise, we publish work that takes time, asks hard questions, and stays with the reader long after the last paragraph.\n\nWe are read by the curious, the informed, and those who believe that understanding the world is an act of citizenship.",
    services: [
      { title: "Features", description: "In-depth investigations and long-form narratives that reveal what headlines miss." },
      { title: "Analysis", description: "Expert commentary and contextual insight on the issues that shape the world." },
      { title: "Profiles", description: "Intimate portraits of the thinkers, makers, and disruptors defining our era." },
    ],
    testimonials: [
      { name: "Prof. Anne K.", role: "Reader", text: "The best long-form journalism being published today. A rare standard of rigour.", rating: 5 },
      { name: "Julien R.", role: "Subscriber", text: "Meridian is the only publication I read cover to cover, every single issue.", rating: 5 },
      { name: "Sarah O.", role: "Journalist", text: "The editorial integrity here is extraordinary. This is what journalism should be.", rating: 5 },
    ],
    ctaText: "Read the latest issue",
  },

  Aurora: {
    heroHeadline: "Radiate from the inside out",
    heroSubline: "Lumière rituals are designed to restore your luminosity — beauty that begins with the self.",
    aboutTitle: "Our philosophy",
    aboutText:
      "Lumière was born from a simple conviction: that beauty is not applied — it is cultivated.\n\nWe blend ancient botanical wisdom with modern skin science to create rituals that nourish the body and calm the mind. Every formula is developed in collaboration with naturopaths, dermatologists, and aromatherapists.\n\nOur products are free from synthetic fragrance, parabens, and compromise. Pure ingredients, purposeful formulation, visible results.",
    services: [
      { title: "Glow Rituals", description: "Signature facial treatments using our proprietary botanical actives and crystal tools." },
      { title: "Body Ceremonies", description: "Full-body treatments that restore the skin's natural luminosity and your inner stillness." },
      { title: "Wellness Coaching", description: "Personalised programmes integrating nutrition, movement, and holistic skincare." },
    ],
    testimonials: [
      { name: "Amara L.", role: "Member", text: "My skin has never looked like this. But more than that — I feel different. Calmer, brighter.", rating: 5 },
      { name: "Zoé P.", role: "Wellness devotee", text: "Lumière rituals are the only luxury I refuse to cut from my life. Worth every penny.", rating: 5 },
      { name: "Dr. Clara M.", role: "Dermatologist", text: "The formulations are genuinely impressive. This is wellness done with real science.", rating: 5 },
    ],
    ctaText: "Book your ritual",
  },

  TechAI: {
    heroHeadline: "Intelligence at the edge of what's possible",
    heroSubline: "NexusAI builds the models, infrastructure, and APIs that the next generation of software runs on.",
    aboutTitle: "Building what comes next",
    aboutText:
      "NexusAI was founded by researchers who left leading AI labs with a conviction: that transformative AI should be accessible infrastructure, not a competitive moat.\n\nWe build foundation models optimised for latency and efficiency, and expose them through clean APIs that any developer can integrate in minutes.\n\nOur models currently process over 1 billion API calls per month across fintech, healthtech, and enterprise SaaS — with 99.99% uptime.",
    services: [
      { title: "Foundation Models", description: "State-of-the-art language and vision models, fine-tunable for your exact domain." },
      { title: "Inference API", description: "Sub-100ms latency across global edge nodes. Scale from prototype to production seamlessly." },
      { title: "Enterprise Suite", description: "Dedicated clusters, SLA guarantees, compliance tooling, and white-glove onboarding." },
    ],
    testimonials: [
      { name: "Yuki T.", role: "CTO, FinTech Series B", text: "We replaced three model vendors with NexusAI. Half the cost, twice the performance.", rating: 5 },
      { name: "Dev O.", role: "ML Lead, Healthcare AI", text: "The fine-tuning pipeline is the best I've used. Our accuracy jumped 18 points.", rating: 5 },
      { name: "Mira S.", role: "VP Eng, Enterprise SaaS", text: "99.99% uptime is real. They've never let us down at scale.", rating: 5 },
    ],
    ctaText: "Start building free",
  },

  MinimalPro: {
    heroHeadline: "Space. Light. Purpose.",
    heroSubline: "Studio Blanc designs buildings that feel inevitable — as though they could never have been otherwise.",
    aboutTitle: "The studio",
    aboutText:
      "Studio Blanc is a Zurich-based architecture practice founded on the principle that excellence lives in restraint.\n\nWe work on a small number of commissions each year, giving each project the full attention it deserves. Our process is slow, deliberate, and collaborative — we do not begin design until we fully understand how you live.\n\nEvery Studio Blanc building is unique. Every one is quiet. And every one gets better with time.",
    services: [
      { title: "Private Residences", description: "Bespoke homes that reflect how their inhabitants think, work, and rest." },
      { title: "Commercial Interiors", description: "Workspaces and retail environments of rare clarity and functional beauty." },
      { title: "Consultancy", description: "Spatial strategy and design direction for developers and property owners." },
    ],
    testimonials: [
      { name: "Marcus F.", role: "Homeowner", text: "Living in a Studio Blanc house has changed how I experience space. It's transformative.", rating: 5 },
      { name: "Lena V.", role: "Retail Director", text: "Our store redesign increased dwell time by 40%. The space does what words cannot.", rating: 5 },
      { name: "Nils H.", role: "Property developer", text: "Studio Blanc added 30% to our asking prices. The work speaks for itself.", rating: 5 },
    ],
    ctaText: "Enquire about a commission",
  },

  default: {
    heroHeadline: "L'excellence, à chaque rendez-vous",
    heroSubline: "Des prestations sur mesure, portées par des années d'expertise et un sens du détail rare.",
    aboutTitle: "Qui sommes-nous",
    aboutText:
      "Nous sommes une équipe passionnée, engagée à livrer des résultats à la hauteur de vos attentes.\n\nAvec une expérience solide dans notre domaine, nous allions expertise technique et approche humaine pour vous accompagner précisément là où vous en avez besoin.\n\nVotre réussite est notre priorité — nous ne sommes satisfaits que lorsque vous l'êtes pleinement.",
    services: [
      { title: "Conseil & accompagnement", description: "Une expertise sur mesure pour répondre à vos enjeux spécifiques et vous orienter avec clarté." },
      { title: "Mise en œuvre", description: "Un accompagnement opérationnel pour transformer vos objectifs en résultats concrets, sans friction." },
      { title: "Suivi & support", description: "Une assistance continue pour pérenniser vos résultats et anticiper les évolutions de votre activité." },
    ],
    testimonials: [
      { name: "Marie P.", role: "Cliente", text: "Une prestation exceptionnelle du début à la fin. Je recommande sans hésiter.", rating: 5 },
      { name: "Thomas B.", role: "Dirigeant", text: "Professionnels, fiables et réellement investis dans la réussite du projet.", rating: 5 },
      { name: "Isabelle C.", role: "Responsable", text: "Ils ont dépassé toutes mes attentes. Je referai appel à eux sans hésiter.", rating: 5 },
    ],
    ctaText: "Prendre contact",
  },
};

// Fuzzy substring match: "Restaurant italien" → "Restaurant", "Coach de vie" → "Coach", etc.
function findFuzzyMatch(businessType: string): string | null {
  const lower = businessType.toLowerCase();
  const aliases: Record<string, string> = {
    restaurant: "Restaurant",
    resto: "Restaurant",
    bistrot: "Restaurant",
    brasserie: "Restaurant",
    pizzeria: "Restaurant",
    café: "Restaurant",
    cafe: "Restaurant",
    bar: "Restaurant",
    hôtel: "Hotel",
    hotel: "Hotel",
    auberge: "Hotel",
    gîte: "Hotel",
    coach: "Coach",
    coaching: "Coach",
    mentor: "Coach",
    thérapeute: "Coach",
    consultant: "Consultant",
    conseil: "Consultant",
    cabinet: "Consultant",
    expert: "Consultant",
    agence: "Agency",
    agency: "Agency",
    studio: "Agency",
    saas: "SaaS",
    logiciel: "SaaS",
    plateforme: "SaaS",
    application: "SaaS",
    startup: "Startup",
    fitness: "Fitness",
    salle: "Fitness",
    musculation: "Fitness",
    gym: "Fitness",
    sport: "Fitness",
    médecin: "Healthcare",
    medecin: "Healthcare",
    dentiste: "Healthcare",
    clinique: "Healthcare",
    santé: "Healthcare",
    immobilier: "RealEstate",
    immo: "RealEstate",
    realestate: "RealEstate",
    evenement: "Event",
    événement: "Event",
    conférence: "Event",
    salon: "Event",
    association: "NonProfit",
    ong: "NonProfit",
    nonprofit: "NonProfit",
    bijoux: "Luxury",
    joaillerie: "Luxury",
    luxury: "Luxury",
    luxe: "Luxury",
    architecte: "Brutalist",
    architecture: "Brutalist",
    magazine: "Magazine",
    media: "Magazine",
    spa: "Aurora",
    beauté: "Aurora",
    cosmétique: "Aurora",
    "bien-être": "Aurora",
    ai: "TechAI",
    ia: "TechAI",
    tech: "TechAI",
  };
  for (const [needle, key] of Object.entries(aliases)) {
    if (lower.includes(needle)) return key;
  }
  return null;
}

// Template-to-profile fallback mapping
const templateToProfile: Record<string, string> = {
  saas: "SaaS",
  startup: "Startup",
  consultant: "Consultant",
  fitness: "Fitness",
  healthcare: "Healthcare",
  realestate: "RealEstate",
  hotel: "Hotel",
  event: "Event",
  nonprofit: "NonProfit",
  restaurant: "Restaurant",
  agency: "Agency",
  luxury: "Luxury",
  brutalist: "Brutalist",
  magazine: "Magazine",
  aurora: "Aurora",
  "3d-tech": "TechAI",
  "minimal-pro": "MinimalPro",
};

export function generateMockContent(formData: FormData): GeneratedContent {
  // Match by businessType first, then fuzzy substring, then template mapping, then default
  const templateFallbackKey = templateToProfile[formData.template ?? ""] ?? "";
  const fuzzyKey = findFuzzyMatch(formData.businessType ?? "") ?? "";
  const base =
    mockByType[formData.businessType] ??
    mockByType[fuzzyKey] ??
    mockByType[templateFallbackKey] ??
    mockByType.default;

  return {
    heroHeadline: base.heroHeadline!,
    heroSubline: base.heroSubline!,
    aboutTitle: base.aboutTitle!,
    aboutText: base.aboutText!,
    services: base.services!,
    testimonials: base.testimonials!,
    ctaText: base.ctaText!,
    metaTitle: `${formData.businessName} — ${formData.tagline || formData.businessType}`,
    metaDescription: base.heroSubline!,
  };
}
