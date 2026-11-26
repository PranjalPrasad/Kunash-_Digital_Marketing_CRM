/* Shared sample data for the client page (Client 360 view). Load after component/modals.js.
   Replace each array with an API call later, e.g. GET /api/clients/{id}/campaigns */
(function () {
  const A = window.AdDesk, cr = (t, s) => ({ t, s });
  const P = (id, name, client, type, unit, price, offer, status, updated, creatives = [], recent = false) =>
    ({ id, name, client, type, unit, price, offer, status, updated, creatives, recent, history: [[updated, 'Added at ₹' + (offer || price).toLocaleString('en-IN'), 'Riya Shah']] });
  const C = (id, name, client, platform, objective, budget, spent, leads, start, end, status) => ({ id, name, client, platform, objective, budget, spent, leads, start, end, status });
  const K = (title, client, format, v, campaign, status, days = 0) => ({ title, client, format, v, campaign, status, days });
  const W = 'Waiting for approval', CH = 'Changes requested';
  A.data = {
    products: [
      P(1, 'Cold Coffee', 'Urban Brew Café', 'Product', 'per glass', 160, 0, 'Active', '1 hr ago', [cr('Offer banner', 'out'), cr('Menu story', 'ok')], true),
      P(2, 'Iced Latte', 'Urban Brew Café', 'Product', 'per glass', 210, 0, 'Active', '2 Sep', [cr('Menu story', 'ok')]),
      P(3, 'Brownie', 'Urban Brew Café', 'Product', 'per piece', 120, 99, 'Active', '10 Nov'),
      P(4, 'Silk Saree Collection', 'Sharma Garments', 'Product', 'per piece', 4999, 3499, 'Active', '9 Nov', [cr('Diwali carousel', 'ok'), cr('Festive reel', 'ok')]),
      P(5, 'Cotton Kurta Set', 'Sharma Garments', 'Product', 'per set', 1499, 0, 'Active', '12 Mar 2025'),
      P(6, 'Gold Coin 5 g', 'Kapoor Jewellers', 'Product', 'per coin', 38500, 0, 'Active', '15 Nov', [], true),
      P(7, 'Annual Membership', 'FitZone Gym', 'Package', 'per year', 14999, 11999, 'Active', '5 Nov', [cr('Membership reel', 'ok')]),
      P(8, 'Monthly Membership', 'FitZone Gym', 'Package', 'per month', 1499, 0, 'Inactive', '1 Aug'),
      P(9, 'Bridal Makeup Package', 'Glow Salon', 'Package', 'per booking', 24999, 0, 'Active', '1 Nov', [cr('Bridal reel', 'ok')]),
      P(10, 'Board Exam Crash Course', 'EduSpark Classes', 'Service', 'per batch', 10500, 0, 'Active', 'Yesterday', [cr('Batch fee banner', 'out')], true),
      P(11, 'Exchange Bonus', 'Zenith Motors', 'Offer', 'per car', 40000, 0, 'Active', '3 hrs ago', [cr('Exchange offer banner', 'out'), cr('Showroom video', 'wait')], true),
      P(12, '3-Seater Sofa', 'Nest Interiors', 'Product', 'per piece', 32000, 25600, 'Active', '14 Nov', [cr('Sofa offer banner', 'chg')]),
      P(13, 'Fresh Veg Box', 'Green Basket', 'Product', 'per box', 399, 349, 'Active', '10 Nov', [cr('Display banner', 'ok')]),
      P(14, 'Teeth Cleaning', 'Bright Smiles Dental', 'Service', 'per visit', 1200, 999, 'Active', '8 Nov', [cr('Camp poster', 'ok')]),
      P(15, 'City Cycle', 'Pune Pedal Cycles', 'Product', 'per piece', 8999, 0, 'Inactive', '31 Jul'),
    ],
    campaigns: [
      C(1, 'Diwali Sale 2026', 'Sharma Garments', 'Meta + Google', 'Sales', 250000, 198400, 612, '2026-10-20', '2026-11-20', 'Active'),
      C(2, 'Dhanteras Gold Offer', 'Kapoor Jewellers', 'Meta', 'Leads', 180000, 148000, 296, '2026-10-25', '2026-11-10', 'Completed'),
      C(3, 'Cold Coffee Offer', 'Urban Brew Café', 'Meta', 'Traffic', 90000, 61200, 120, '2026-11-01', '2026-11-30', 'Active'),
      C(4, 'Membership Drive', 'FitZone Gym', 'Meta', 'Leads', 120000, 96000, 541, '2026-11-05', '2026-11-30', 'Paused'),
      C(5, 'Bridal Package', 'Glow Salon', 'Meta', 'Leads', 80000, 73600, 377, '2026-11-01', '2026-11-25', 'Active'),
      C(6, 'Fresh Veg Weekend', 'Green Basket', 'Google Ads', 'Traffic', 70000, 40100, 301, '2026-11-10', '2026-12-10', 'Active'),
      C(7, 'Dental Checkup Camp', 'Bright Smiles Dental', 'Meta', 'Leads', 45000, 0, 0, '2026-11-25', '2026-12-15', 'Scheduled'),
      C(8, 'Winter Collection', 'Nest Interiors', 'Meta + Google', 'Sales', 160000, 0, 0, '2026-12-01', '2026-12-31', 'Pending approval'),
      C(9, 'Exam Prep Batch', 'EduSpark Classes', 'Google Ads', 'Leads', 55000, 0, 0, '2026-12-05', '2027-01-05', 'Draft'),
      C(10, 'Year-end Car Fest', 'Zenith Motors', 'Meta + Google', 'Awareness', 200000, 0, 0, '2026-12-10', '2026-12-31', 'Draft'),
      C(11, 'Monsoon Cycle Sale', 'Pune Pedal Cycles', 'Meta', 'Sales', 40000, 40000, 98, '2026-07-01', '2026-07-31', 'Completed'),
      C(12, 'Healthy Tiffin Launch', 'Royal Tiffin', 'Meta', 'Awareness', 30000, 29500, 76, '2026-08-01', '2026-08-20', 'Completed'),
    ],
    creatives: [
      K('Diwali carousel', 'Sharma Garments', 'Carousel', 3, 'Diwali Sale 2026', 'Approved'), K('Festive reel', 'Sharma Garments', 'Video', 2, 'Diwali Sale 2026', 'Approved'),
      K('Offer banner', 'Urban Brew Café', 'Image', 2, 'Cold Coffee Offer', 'Outdated'), K('Menu story', 'Urban Brew Café', 'Image', 1, 'Cold Coffee Offer', 'Approved'),
      K('Winter lookbook', 'Nest Interiors', 'Carousel', 1, 'Winter Collection', W, 3), K('Sofa offer banner', 'Nest Interiors', 'Image', 2, 'Winter Collection', CH, 1),
      K('Showroom video', 'Zenith Motors', 'Video', 1, 'Year-end Car Fest', W, 1), K('Exchange offer banner', 'Zenith Motors', 'Image', 1, 'Year-end Car Fest', 'Outdated'),
      K('Batch fee banner', 'EduSpark Classes', 'Image', 1, 'Exam Prep Batch', 'Outdated'), K('Membership reel', 'FitZone Gym', 'Video', 1, 'Membership Drive', 'Approved'),
      K('Bridal reel', 'Glow Salon', 'Video', 2, 'Bridal Package', 'Approved'), K('Wedding teaser', 'Kapoor Jewellers', 'Image', 1, '', 'Draft'),
      K('Savings scheme post', 'Heritage Patsanstha', 'Image', 2, '', 'Approved'), K('Notice board post', 'Heritage Patsanstha', 'Image', 1, '', W, 2),
    ],
    leads: [
      ['Aditi Verma', 'Sharma Garments', 'Diwali Sale 2026', 'Meta Lead Ad', 'New', 'Hot', '', 12000, '2026-11-18'], ['Rahul Deshmukh', 'Sharma Garments', 'Diwali Sale 2026', 'Google Ads', 'Contacted', 'Warm', 'Riya Shah', 8500, '2026-11-16'],
      ['Meena Joshi', 'Sharma Garments', 'Diwali Sale 2026', 'Meta Lead Ad', 'Won', 'Hot', 'Riya Shah', 15000, '2026-11-02'], ['Sunita Rao', 'Glow Salon', 'Bridal Package', 'Meta Lead Ad', 'Qualified', 'Hot', 'Neha Rao', 25000, '2026-11-14'],
      ['Divya Iyer', 'Glow Salon', 'Bridal Package', 'Meta Lead Ad', 'Contacted', 'Hot', 'Neha Rao', 24999, '2026-11-17'], ['Mohit Jain', 'FitZone Gym', 'Membership Drive', 'Meta Lead Ad', 'New', 'Warm', '', 11999, '2026-11-18'],
      ['Kavita Patil', 'FitZone Gym', 'Membership Drive', 'Meta Lead Ad', 'Contacted', 'Cold', 'Kabir Jain', 11999, '2026-11-12'], ['Amit Shah', 'Urban Brew Café', 'Cold Coffee Offer', 'Website', 'Won', 'Warm', 'Neha Rao', 4500, '2026-11-05'],
      ['Karan Singh', 'Urban Brew Café', 'Cold Coffee Offer', 'Meta Lead Ad', 'Contacted', 'Cold', 'Riya Shah', 800, '2026-11-15'], ['Neha Kulkarni', 'Nest Interiors', 'Winter Collection', 'Website', 'Qualified', 'Hot', 'Kabir Jain', 32000, '2026-11-15'],
      ['Isha Malhotra', 'Nest Interiors', 'Winter Collection', 'Meta Lead Ad', 'New', 'Cold', '', 25600, '2026-11-18'], ['Rohan Mehta', 'Zenith Motors', 'Year-end Car Fest', 'Google Ads', 'New', 'Hot', '', 600000, '2026-11-18'],
      ['Tushar Bhosale', 'Zenith Motors', 'Year-end Car Fest', 'Manual', 'Qualified', 'Warm', 'Neha Rao', 450000, '2026-11-16'], ['Pooja Nair', 'Bright Smiles Dental', 'Dental Checkup Camp', 'Meta Lead Ad', 'New', 'Warm', 'Riya Shah', 3000, '2026-11-17'],
      ['Sanjay Gupta', 'Kapoor Jewellers', 'Dhanteras Gold Offer', 'Manual', 'Won', 'Hot', 'Kabir Jain', 76000, '2026-10-28'], ['Arjun Kapoor', 'Kapoor Jewellers', 'Dhanteras Gold Offer', 'Meta Lead Ad', 'Lost', 'Cold', 'Kabir Jain', 38500, '2026-11-01'],
      ['Farah Khan', 'EduSpark Classes', 'Exam Prep Batch', 'Website', 'Contacted', 'Warm', 'Neha Rao', 10500, '2026-11-13'], ['Vikas Pawar', 'Green Basket', 'Fresh Veg Weekend', 'Google Ads', 'Lost', 'Cold', 'Riya Shah', 1200, '2026-11-09'],
    ].map(([name, client, campaign, source, status, rating, owner, value, created]) => ({ name, client, campaign, source, status, rating, owner, value, created })),
  };
})();