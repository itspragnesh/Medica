var medicines = [
  // Paracetamol
  { company: 'GSK', brandName: 'Crocin', formula: 'Paracetamol', image: '/images/crocin-gsk-paracetamol.jpg', price: '$5.00' },
  { company: 'Abbott', brandName: 'Calpol', formula: 'Paracetamol', image: '/images/calpol-abbott-paracetamol.jpg', price: '$5.20' },
  { company: 'Medley', brandName: 'DOO-650', formula: 'Paracetamol', image: '/images/doo650-medley-paracetamol.jpg', price: '$4.80' },
  // Ibuprofen
  { company: 'Abbott', brandName: 'Brufen', formula: 'Ibuprofen', image: '/images/brufen-abbott-ibuprofen.jpg', price: '$6.00' },
  { company: 'Cipla', brandName: 'Ibugesic', formula: 'Ibuprofen', image: '/images/ibugesic-cipla-ibuprofen.jpg', price: '$5.80' },
  // Aspirin
  { company: 'USV', brandName: 'Ecosprin', formula: 'Aspirin', image: '/images/ecosprin-usv-aspirin.jpg', price: '$4.50' },
  { company: 'Reckitt', brandName: 'Disprin', formula: 'Aspirin', image: '/images/disprin-reckitt-aspirin.jpg', price: '$4.70' },
  // Amoxicillin
  { company: 'GSK', brandName: 'Amoxil', formula: 'Amoxicillin', image: '/images/amoxil-gsk-amoxicillin.jpg', price: '$8.00' },
  { company: 'Sun Pharma', brandName: 'Mox', formula: 'Amoxicillin', image: '/images/mox-sunpharma-amoxicillin.jpg', price: '$7.80' },
  // Azithromycin
  { company: 'Alembic', brandName: 'Azithral', formula: 'Azithromycin', image: '/images/azithral-alembic-azithromycin.jpg', price: '$9.00' },
  { company: 'Pfizer', brandName: 'Zithromax', formula: 'Azithromycin', image: '/images/zithromax-pfizer-azithromycin.jpg', price: '$9.20' },
  // Cetirizine
  { company: 'Dr. Reddy’s', brandName: 'Cetzine', formula: 'Cetirizine', image: '/images/cetzine-drreddys-cetirizine.jpg', price: '$3.50' },
  { company: 'Cipla', brandName: 'Okacet', formula: 'Cetirizine', image: '/images/okacet-cipla-cetirizine.jpg', price: '$3.40' },
  // Diphenhydramine
  { company: 'Johnson & Johnson', brandName: 'Benadryl', formula: 'Diphenhydramine', image: '/images/benadryl-jj-diphenhydramine.jpg', price: '$4.00' },
  // Ranitidine / Famotidine
  { company: 'J.B. Chemicals', brandName: 'Rantac', formula: 'Ranitidine', image: '/images/rantac-jbchemicals-ranitidine.jpg', price: '$5.50' },
  { company: 'Sun Pharma', brandName: 'Famocid', formula: 'Famotidine', image: '/images/famocid-sunpharma-famotidine.jpg', price: '$5.60' },
  // Loperamide
  { company: 'Janssen', brandName: 'Imodium', formula: 'Loperamide', image: '/images/imodium-janssen-loperamide.jpg', price: '$3.00' },
  { company: 'Micro Labs', brandName: 'Eldoper', formula: 'Loperamide', image: '/images/eldoper-microlabs-loperamide.jpg', price: '$2.90' },
  // ORS
  { company: 'FDC', brandName: 'Electral', formula: 'ORS', image: '/images/electral-fdc-ors.jpg', price: '$2.00' },
  { company: 'Cipla', brandName: 'Enerzal', formula: 'ORS', image: '/images/enerzal-cipla-ors.jpg', price: '$2.10' },
  // Ondansetron
  { company: 'Cipla', brandName: 'Emeset', formula: 'Ondansetron', image: '/images/emeset-cipla-ondansetron.jpg', price: '$6.50' },
  { company: 'Alkem', brandName: 'Ondem', formula: 'Ondansetron', image: '/images/ondem-alkem-ondansetron.jpg', price: '$6.40' },
  // Dextromethorphan
  { company: 'Pfizer', brandName: 'Corex-D', formula: 'Dextromethorphan', image: '/images/corexd-pfizer-dextromethorphan.jpg', price: '$4.80' },
  { company: 'Johnson & Johnson', brandName: 'Benadryl-D', formula: 'Dextromethorphan', image: '/images/benadryld-jj-dextromethorphan.jpg', price: '$4.90' },
  // Salbutamol
  { company: 'Cipla', brandName: 'Asthalin', formula: 'Salbutamol', image: '/images/asthalin-cipla-salbutamol.jpg', price: '$7.00' },
  { company: 'GSK', brandName: 'Ventolin', formula: 'Salbutamol', image: '/images/ventolin-gsk-salbutamol.jpg', price: '$7.10' },
  // Hydrocortisone Cream
  { company: 'Pfizer', brandName: 'Cortizone-10', formula: 'Hydrocortisone Cream', image: '/images/cortizone10-pfizer-hydrocortisone.jpg', price: '$5.20' },
  { company: 'Zydus', brandName: 'Cortimate', formula: 'Hydrocortisone Cream', image: '/images/cortimate-zydus-hydrocortisone.jpg', price: '$5.30' },
  // Povidone-Iodine
  { company: 'Win-Medicare', brandName: 'Betadine', formula: 'Povidone-Iodine', image: '/images/betadine-winmedicare-povidone.jpg', price: '$3.80' },
  // Clotrimazole Cream
  { company: 'Glenmark', brandName: 'Candid', formula: 'Clotrimazole Cream', image: '/images/candid-glenmark-clotrimazole.jpg', price: '$4.90' },
  { company: 'Bayer', brandName: 'Canesten', formula: 'Clotrimazole Cream', image: '/images/canesten-bayer-clotrimazole.jpg', price: '$5.00' },
  // Calamine Lotion
  { company: 'Piramal', brandName: 'Caladryl', formula: 'Calamine Lotion', image: '/images/caladryl-piramal-calamine.jpg', price: '$3.20' },
  { company: 'Nykaa', brandName: 'Lacto Calamine', formula: 'Calamine Lotion', image: '/images/lactocalamine-nykaa-calamine.jpg', price: '$3.30' },
  // Multivitamins
  { company: 'Pfizer', brandName: 'Becosules', formula: 'Multivitamins', image: '/images/becosules-pfizer-multivitamins.jpg', price: '$10.00' },
  { company: 'Bayer', brandName: 'Supradyn', formula: 'Multivitamins', image: '/images/supradyn-bayer-multivitamins.jpg', price: '$10.20' },
  // Iron + Folic Acid
  { company: 'Abbott', brandName: 'Livogen', formula: 'Iron + Folic Acid', image: '/images/livogen-abbott-ironfolic.jpg', price: '$6.80' },
  { company: 'Macleods', brandName: 'Feronia-XT', formula: 'Iron + Folic Acid', image: '/images/feroniaxt-macleods-ironfolic.jpg', price: '$6.90' },
  // Antacids
  { company: 'Pfizer', brandName: 'Gelusil', formula: 'Antacids', image: '/images/gelusil-pfizer-antacids.jpg', price: '$4.00' },
  { company: 'Abbott', brandName: 'Digene', formula: 'Antacids', image: '/images/digene-abbott-antacids.jpg', price: '$4.10' },
  // Metformin
  { company: 'USV', brandName: 'Glycomet', formula: 'Metformin', image: '/images/glycomet-usv-metformin.jpg', price: '$6.00' },
  { company: 'Franco-Indian', brandName: 'Gluconorm', formula: 'Metformin', image: '/images/gluconorm-francoindian-metformin.jpg', price: '$6.20' },
  // Glimepiride
  { company: 'Sanofi', brandName: 'Amaryl', formula: 'Glimepiride', image: '/images/amaryl-sanofi-glimepiride.jpg', price: '$7.50' },
  { company: 'Glenmark', brandName: 'Glinate', formula: 'Glimepiride', image: '/images/glinate-glenmark-glimepiride.jpg', price: '$7.30' },
  // Amlodipine
  { company: 'Micro Labs', brandName: 'Amlong', formula: 'Amlodipine', image: '/images/amlong-microlabs-amlodipine.jpg', price: '$5.00' },
  { company: 'Cipla', brandName: 'Stamlo', formula: 'Amlodipine', image: '/images/stamlo-cipla-amlodipine.jpg', price: '$5.10' },
  // Telmisartan
  { company: 'Glenmark', brandName: 'Telma', formula: 'Telmisartan', image: '/images/telma-glenmark-telmisartan.jpg', price: '$6.80' },
  { company: 'Cipla', brandName: 'Telpres', formula: 'Telmisartan', image: '/images/telpres-cipla-telmisartan.jpg', price: '$6.90' },
  // Losartan
  { company: 'Torrent', brandName: 'Losar', formula: 'Losartan', image: '/images/losar-torrent-losartan.jpg', price: '$6.50' },
  { company: 'Sun Pharma', brandName: 'Repace', formula: 'Losartan', image: '/images/repace-sunpharma-losartan.jpg', price: '$6.40' },
  // Atorvastatin
  { company: 'Pfizer', brandName: 'Lipitor', formula: 'Atorvastatin', image: '/images/lipitor-pfizer-atorvastatin.jpg', price: '$8.00' },
  { company: 'Zydus', brandName: 'Atocor', formula: 'Atorvastatin', image: '/images/atocor-zydus-atorvastatin.jpg', price: '$7.90' },
  // Rosuvastatin
  { company: 'AstraZeneca', brandName: 'Crestor', formula: 'Rosuvastatin', image: '/images/crestor-astrazeneca-rosuvastatin.jpg', price: '$8.50' },
  { company: 'Sun Pharma', brandName: 'Rozavel', formula: 'Rosuvastatin', image: '/images/rozavel-sunpharma-rosuvastatin.jpg', price: '$8.30' },
  // Levothyroxine
  { company: 'Abbott', brandName: 'Thyronorm', formula: 'Levothyroxine', image: '/images/thyronorm-abbott-levothyroxine.jpg', price: '$4.50' },
  { company: 'GSK', brandName: 'Eltroxin', formula: 'Levothyroxine', image: '/images/eltroxin-gsk-levothyroxine.jpg', price: '$4.60' },
  // Rabeprazole
  { company: 'Dr. Reddy’s', brandName: 'Razo', formula: 'Rabeprazole', image: '/images/razo-drreddys-rabeprazole.jpg', price: '$5.70' },
  { company: 'Cipla', brandName: 'Rabicip', formula: 'Rabeprazole', image: '/images/rabicip-cipla-rabeprazole.jpg', price: '$5.60' },
  // Pantoprazole
  { company: 'Sun Pharma', brandName: 'Pantocid', formula: 'Pantoprazole', image: '/images/pantocid-sunpharma-pantoprazole.jpg', price: '$5.00' },
  { company: 'Alkem', brandName: 'Pan 40', formula: 'Pantoprazole', image: '/images/pan40-alkem-pantoprazole.jpg', price: '$4.90' },
  // Montelukast
  { company: 'Sun Pharma', brandName: 'Montek LC', formula: 'Montelukast', image: '/images/monteklc-sunpharma-montelukast.jpg', price: '$6.00' },
  { company: 'Cipla', brandName: 'Telekast-L', formula: 'Montelukast', image: '/images/telekastl-cipla-montelukast.jpg', price: '$5.90' },
  // Levocetirizine
  { company: 'Cipla', brandName: 'Levocet', formula: 'Levocetirizine', image: '/images/levocet-cipla-levocetirizine.jpg', price: '$3.80' },
  { company: 'Mankind', brandName: 'LCZ', formula: 'Levocetirizine', image: '/images/lcz-mankind-levocetirizine.jpg', price: '$3.70' },
  // Chlorpheniramine
  { company: 'Abbott', brandName: 'CPM', formula: 'Chlorpheniramine', image: '/images/cpm-abbott-chlorpheniramine.jpg', price: '$3.00' },
  { company: 'Mankind', brandName: 'Allerga', formula: 'Chlorpheniramine', image: '/images/allerga-mankind-chlorpheniramine.jpg', price: '$3.10' },
  // Guaifenesin
  { company: 'Alembic', brandName: 'Glycodin', formula: 'Guaifenesin', image: '/images/glycodin-alembic-guaifenesin.jpg', price: '$4.50' },
  { company: 'Glenmark', brandName: 'Ascoril', formula: 'Guaifenesin', image: '/images/ascoril-glenmark-guaifenesin.jpg', price: '$4.60' },
  // Mupirocin
  { company: 'GlaxoSmithKline', brandName: 'T-Bact', formula: 'Mupirocin', image: '/images/tbact-gsk-mupirocin.jpg', price: '$5.50' },
  // Ofloxacin + Ornidazole
  { company: 'Cipla', brandName: 'O2', formula: 'Ofloxacin + Ornidazole', image: '/images/o2-cipla-ofloxacinornidazole.jpg', price: '$7.00' },
  { company: 'Macleods', brandName: 'Oflomac-OZ', formula: 'Ofloxacin + Ornidazole', image: '/images/oflomacoz-macleods-ofloxacinornidazole.jpg', price: '$6.90' },
  // Ciprofloxacin
  { company: 'Sun Pharma', brandName: 'Cifran', formula: 'Ciprofloxacin', image: '/images/cifran-sunpharma-ciprofloxacin.jpg', price: '$6.50' },
  { company: 'Cipla', brandName: 'Ciplox', formula: 'Ciprofloxacin', image: '/images/ciplox-cipla-ciprofloxacin.jpg', price: '$6.40' },
  // Chlorhexidine Mouthwash
  { company: 'ICPA', brandName: 'Hexidine', formula: 'Chlorhexidine Mouthwash', image: '/images/hexidine-icpa-chlorhexidine.jpg', price: '$3.50' },
  { company: 'Dr. Reddy’s', brandName: 'Clohex', formula: 'Chlorhexidine Mouthwash', image: '/images/clohex-drreddys-chlorhexidine.jpg', price: '$3.60' },
  // Carboxymethylcellulose (Eye Drops)
  { company: 'Allergan', brandName: 'Refresh Tears', formula: 'Carboxymethylcellulose', image: '/images/refreshtears-allergan-carboxymethylcellulose.jpg', price: '$8.00' },
  { company: 'Cipla', brandName: 'Tearfree', formula: 'Carboxymethylcellulose', image: '/images/tearfree-cipla-carboxymethylcellulose.jpg', price: '$7.80' },
  // Diclofenac Gel
  { company: 'Novartis', brandName: 'Voveran Gel', formula: 'Diclofenac Gel', image: '/images/voverangel-novartis-diclofenac.jpg', price: '$4.80' },
  { company: 'Troikaa', brandName: 'Dynapar Gel', formula: 'Diclofenac Gel', image: '/images/dynapargel-troikaa-diclofenac.jpg', price: '$4.90' },
];

export default medicines;