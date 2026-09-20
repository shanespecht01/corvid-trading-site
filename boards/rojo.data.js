// ================================================================
// Board data for RoJo Legacy (boards/rojo.html).
// Plain data — no coding needed to tweak copy, prices, or products.
// See README.md "Client idea boards" for the full field reference.
// ================================================================
window.BOARD_DATA = {
  slug: 'rojo',
  client: {
    name: 'RoJo Legacy',
    focus: 'Spirit, team travel, fundraising, and sponsor gear for Austin’s girls flag football program',
    preparedDate: 'September 2026',
    brandColors: [
      { name: 'RoJo Blue', hex: '#29b6f6' },
      { name: 'RoJo Violet', hex: '#7c4dff' },
      { name: 'RoJo Lime', hex: '#8bc34a' },
      { name: 'RoJo Cyan', hex: '#22e6e6' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#f5f5f5' }
    ]
  },
  calculatorDefaults: { cost: 2.25, sell: 8, qty: 300 },
  sections: [
    {
      id: 'spirit',
      title: 'Spirit Wear',
      blurb: 'Gear for the parents and fans in the stands — built for a Texas sideline, not a closet.',
      products: [
        {
          id: 'spirit-tee', family: 'apparel', name: 'Sideline Fan Tee',
          note: 'Lightweight and moisture-wicking so parents can wear it through an Austin September and still reach for it in October.',
          decoration: 'Screen print', colors: ['RoJo Blue', 'White'],
          uses: ['Fan gear', 'Team store add-on'], estCost: 6.50, estRetail: 16,
          searchTerm: 'moisture wicking tee'
        },
        {
          id: 'spirit-cap', family: 'headwear', name: 'Structured Trucker Cap',
          note: 'Vented back keeps sideline parents cool, and the diamond mark embroiders clean even at cap size.',
          decoration: 'Embroidery', colors: ['RoJo Blue', 'Black'],
          uses: ['Fan gear', 'Coach gift'], estCost: 8, estRetail: 20,
          searchTerm: 'structured trucker cap'
        },
        {
          id: 'spirit-hat', family: 'headwear', name: 'Wide-Brim Sun Hat (UPF 50)',
          note: 'Real sun protection for a full Saturday of games in Texas heat, not just a logo on a hat.',
          decoration: 'Embroidered patch', colors: ['Black', 'RoJo Lime'],
          uses: ['Sideline parents', '10U families'], estCost: 9, estRetail: 22,
          searchTerm: 'UPF wide brim hat'
        }
      ]
    },
    {
      id: 'team',
      title: 'Team & Sideline',
      blurb: 'What the roster and coaching staff actually use — travel circuit and recruiting-ready.',
      products: [
        {
          id: 'team-tumbler', family: 'drinkware', name: '30oz Insulated Tumbler',
          note: 'Keeps water cold through two-a-days in August heat — the kind of reorder item that sells itself once one parent has one.',
          decoration: 'Laser engrave', colors: ['RoJo Blue', 'RoJo Violet'],
          uses: ['Players', 'Coaches', 'Team store'], estCost: 11, estRetail: 28,
          searchTerm: '30oz insulated tumbler'
        },
        {
          id: 'team-polo', family: 'apparel', name: "Coach's Performance Polo",
          note: 'A clean, professional layer for Coach Korpela and staff at recruiting events — he’s talking to NCSA families, the polo should look the part.',
          decoration: 'Embroidery', colors: ['Black', 'RoJo Blue'],
          uses: ['Coaching staff', 'Recruiting events'], estCost: 19, estRetail: 42,
          searchTerm: 'performance polo embroidered'
        },
        {
          id: 'team-duffel', family: 'bags', name: 'Team Travel Duffel',
          note: 'Built for the national travel circuit — AT&T Stadium and beyond — with room for pads, cleats, and a change of clothes.',
          decoration: 'Embroidery', colors: ['Black', 'RoJo Blue'],
          uses: ['HS travel team', 'Tournament trips'], estCost: 24, estRetail: 55,
          searchTerm: 'team travel duffel bag'
        }
      ]
    },
    {
      id: 'fundraising',
      title: 'Fundraising',
      blurb: 'Small, margin-smart items that fund travel and entry fees at the concession table.',
      products: [
        {
          id: 'fund-coolie', family: 'drinkware', name: 'Neoprene Can Cooler',
          note: 'The same category we sourced for a touring band’s merch table — tiny cost, sells itself between games at the concession stand.',
          decoration: 'Screen print', colors: ['RoJo Blue', 'RoJo Lime'],
          uses: ['Concession fundraiser', 'Tournament merch table'], estCost: 2.25, estRetail: 8,
          searchTerm: 'neoprene can cooler'
        },
        {
          id: 'fund-wristband', family: 'accessory', name: 'Silicone Wristband',
          note: '"Build the Power of Girls" debossed — a $3 add-on at the merch table that pays for itself after the first ten sold.',
          decoration: 'Debossed silicone', colors: ['RoJo Blue', 'RoJo Violet'],
          uses: ['Concession fundraiser', 'Donor thank-you'], estCost: 0.60, estRetail: 3,
          searchTerm: 'silicone wristband debossed'
        },
        {
          id: 'fund-cinch', family: 'bags', name: 'Drawstring Cinch Bag',
          note: 'Doubles as a $10-donor thank-you and a cleats bag for the 10U roster — one item, two jobs.',
          decoration: 'Screen print', colors: ['Black', 'RoJo Blue'],
          uses: ['Donor tier gift', '10U gear bag'], estCost: 3.50, estRetail: 12,
          searchTerm: 'drawstring cinch bag'
        }
      ]
    },
    {
      id: 'sponsor',
      title: 'Sponsor & Recruiting',
      blurb: 'Thank-yous and visibility pieces for Championship and Legacy tier sponsors.',
      products: [
        {
          id: 'sponsor-quarterzip', family: 'outerwear', name: 'Embroidered Quarter-Zip',
          note: 'A Legacy-tier sponsor thank-you that actually gets worn to their own office — better mileage than a plaque.',
          decoration: 'Embroidery', colors: ['Black', 'RoJo Violet'],
          uses: ['Legacy sponsor gift', 'Staff sideline layer'], estCost: 28, estRetail: 60,
          searchTerm: 'quarter zip pullover embroidered'
        },
        {
          id: 'sponsor-banner', family: 'event', name: 'Retractable Step-and-Repeat Banner',
          note: 'For team photos at AT&T Stadium and sponsor visibility at every tournament — one-time buy, reused all season.',
          decoration: 'Full-color print', colors: ['Black', 'RoJo Blue', 'RoJo Violet'],
          uses: ['Tournament backdrop', 'Sponsor visibility'], estCost: 85, estRetail: 175,
          searchTerm: 'retractable step and repeat banner'
        },
        {
          id: 'sponsor-giftbox', family: 'gifts', name: 'Sponsor Thank-You Box',
          note: 'Tumbler, cap, and sticker set in a branded box — the kind of thank-you that gets a Championship sponsor to renew.',
          decoration: 'Mixed (engrave + embroidery)', colors: ['RoJo Blue', 'RoJo Violet', 'RoJo Lime'],
          uses: ['Championship sponsor gift', 'Donor renewal'], estCost: 32, estRetail: 70,
          searchTerm: 'corporate gift box kit'
        }
      ]
    }
  ]
};
