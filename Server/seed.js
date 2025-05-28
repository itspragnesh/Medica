const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const Doctor = require('./models/Doctor'); // Import the Doctor model
require('dotenv').config();

// Company image mapping
const companyImageMap = {
  'GSK': '/images/gsk.png',
  'Medley': '/images/medley.png',
  'Abbott': '/images/abbott.png',
  'Cipla': '/images/cipla.png',
  'USV': '/images/usv.png',
  'Reckitt': '/images/reckitt.png',
  'Sun Pharma': '/images/sun.png',
  'Alembic': '/images/alembic.png',
  'Pfizer': '/images/pfizer.png',
  "Dr. Reddy's": '/images/dr.reddy.png',
  'Johnson & Johnson': '/images/johnson.png',
  'J.B. Chemicals': '/images/jb.png',
  'Janssen': '/images/janssen.png',
  'Micro Labs': '/images/microlabs.png',
  'FDC': '/images/fdc.png',
  'Alkem': '/images/alkem.png',
  'Benadryl': '/images/benlogo.png',
  'Zydus': '/images/zydus.png',
  'Win-Medicare': '/images/winmedicare.png',
  'Glenmark': '/images/glenmark.png',
  'Bayer': '/images/bayer.png',
  'Piramal': '/images/pirimal.png',
  'Nykaa': '/images/nykaa.png',
  'Franco-Indian': '/images/francoindian.png',
  'Sanofi': '/images/sanofi.png',
  'Torrent': '/images/torrent.png',
  'AstraZeneca': '/images/astrazeneca.png',
  'Macleods': '/images/macleods.png',
  'Mankind': '/images/mankind.png',
  'Novartis': '/images/novartis.png',
  'Troikaa': '/images/troikaa.png',
  'Zandu': '/images/zandu.png',
  'Vicks': '/images/vicks.png',
  'ICPA': '/images/icpa.png',
  'Allergan': '/images/allergan.png',
  'Win-Medicare': '/images/win.png',
};

// Medicines data
const medicines = [
  { id: 1, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'Crocin', formula: 'Paracetamol', image: '/images/crocin.png', price: 415.00, description: 'Relieves mild to moderate pain and fever.', dosage: '1-2 tablets every 4-6 hours as needed.' },
  { id: 2, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'Calpol', formula: 'Paracetamol', image: '/images/calpol.png', price: 431.60, description: 'Effective for fever and pain relief in children and adults.', dosage: '1 tablet every 4-6 hours.' },
  { id: 3, company: 'Medley', companyImage: companyImageMap['Medley'], brandName: 'DOLO-650', formula: 'Paracetamol', image: '/images/dolo.png', price: 398.40, description: 'For relief from headache, fever, and body aches.', dosage: '1 tablet every 6 hours.' },
  { id: 4, company: 'Abbott', companyImage: companyImageMap['Abbott'], brandName: 'Brufen', formula: 'Ibuprofen', image: '/images/brufen.png', price: 498.00, description: 'Reduces inflammation, pain, and fever.', dosage: '1 tablet every 8 hours after food.' },
  { id: 5, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Ibugesic', formula: 'Ibuprofen', image: '/images/ibugesic.png', price: 481.40, description: 'For pain relief and anti-inflammatory action.', dosage: '1 tablet every 6-8 hours.' },
  { id: 6, company: 'USV', companyImage: companyImageMap['USV'], brandName: 'Ecosprin', formula: 'Aspirin', image: '/images/ecospirin.png', price: 373.50, description: 'Used for pain relief and as a blood thinner.', dosage: '1 tablet daily or as prescribed.' },
  { id: 7, company: 'Reckitt', companyImage: companyImageMap['Reckitt'], brandName: 'Disprin', formula: 'Aspirin', image: '/images/disprin.png', price: 390.10, description: 'Quick relief from headaches and mild pain.', dosage: '1 tablet dissolved in water every 4 hours.' },
  { id: 8, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'Amoxil', formula: 'Amoxicillin', image: '/images/amoxil.png', price: 664.00, description: 'Antibiotic for bacterial infections.', dosage: '1 capsule every 8 hours for 5-7 days.' },
  { id: 9, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Mox', formula: 'Amoxicillin', image: '/images/mox.png', price: 647.40, description: 'Treats infections like ear, throat, and urinary tract infections.', dosage: '1 capsule every 8 hours.' },
  { id: 10, company: 'Alembic', companyImage: companyImageMap['Alembic'], brandName: 'Azithral', formula: 'Azithromycin', image: '/images/azith.png', price: 747.00, description: 'Broad-spectrum antibiotic for respiratory infections.', dosage: '1 tablet daily for 3 days.' },
  { id: 11, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Zithromax', formula: 'Azithromycin', image: '/images/zithro.png', price: 763.60, description: 'For bacterial infections including pneumonia.', dosage: '1 tablet daily for 3-5 days.' },
  { id: 12, company: "Dr. Reddy's", companyImage: companyImageMap["Dr. Reddy's"], brandName: 'Cetzine', formula: 'Cetirizine', image: '/images/cetzine.png', price: 290.50, description: 'Relieves allergy symptoms like sneezing and itching.', dosage: '1 tablet daily at bedtime.' },
  { id: 13, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Okacet', formula: 'Cetirizine', image: '/images/okacet.png', price: 282.20, description: 'For allergic rhinitis and skin allergies.', dosage: '1 tablet daily.' },
  { id: 14, company: 'Johnson & Johnson', companyImage: companyImageMap['Johnson & Johnson'], brandName: 'Baby Powder', formula: 'Talcum Powder', image: '/images/babypowder.png', price: 332.00, description: 'Soothes skin and prevents irritation.', dosage: 'Apply as needed on dry skin.' },
  { id: 15, company: 'J.B. Chemicals', companyImage: companyImageMap['J.B. Chemicals'], brandName: 'Rantac', formula: 'Ranitidine', image: '/images/rantac.png', price: 456.50, description: 'Reduces stomach acid for ulcer relief.', dosage: '1 tablet twice daily.' },
  { id: 16, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Famocid', formula: 'Famotidine', image: '/images/famocid.png', price: 464.80, description: 'Treats heartburn and acid reflux.', dosage: '1 tablet daily before meals.' },
  { id: 17, company: 'Janssen', companyImage: companyImageMap['Janssen'], brandName: 'Imodium', formula: 'Loperamide', image: '/images/imodium.png', price: 249.00, description: 'Controls acute diarrhea.', dosage: '2 capsules initially, then 1 after each loose stool.' },
  { id: 18, company: 'Micro Labs', companyImage: companyImageMap['Micro Labs'], brandName: 'Eldoper', formula: 'Loperamide', image: '/images/eldoper.png', price: 240.70, description: 'For symptomatic relief of diarrhea.', dosage: '1 capsule after each loose stool.' },
  { id: 19, company: 'FDC', companyImage: companyImageMap['FDC'], brandName: 'Electral', formula: 'ORS', image: '/images/electral.png', price: 166.00, description: 'Rehydrates the body during dehydration.', dosage: 'Dissolve in 1 liter of water and sip throughout the day.' },
  { id: 20, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Enerzal', formula: 'ORS', image: '/images/enerzal.png', price: 174.30, description: 'Restores electrolytes and energy.', dosage: 'Mix with water and drink as needed.' },
  { id: 21, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Emeset', formula: 'Ondansetron', image: '/images/emecet.png', price: 539.50, description: 'Prevents nausea and vomiting.', dosage: '1 tablet 30 minutes before chemotherapy.' },
  { id: 22, company: 'Alkem', companyImage: companyImageMap['Alkem'], brandName: 'Ondem', formula: 'Ondansetron', image: '/images/ondem.png', price: 531.20, description: 'For nausea due to surgery or chemotherapy.', dosage: '1 tablet as prescribed.' },
  { id: 23, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Corex-D', formula: 'Dextromethorphan', image: '/images/corex.png', price: 398.40, description: 'Relieves dry cough.', dosage: '10ml every 6 hours.' },
  { id: 24, company: 'Benadryl', companyImage: companyImageMap['Benadryl'], brandName: 'Benadryl-Dr', formula: 'Dextromethorphan', image: '/images/bendryl-dr.png', price: 406.70, description: 'For cough suppression.', dosage: '10ml every 4-6 hours.' },
  { id: 25, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Asthalin', formula: 'Salbutamol', image: '/images/asthalin.png', price: 581.00, description: 'Relieves asthma symptoms.', dosage: '2 puffs every 4-6 hours.' },
  { id: 26, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'Ventolin', formula: 'Salbutamol', image: '/images/ventolin.png', price: 589.30, description: 'For bronchospasm relief in asthma.', dosage: '1-2 puffs as needed.' },
  { id: 27, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Cortef', formula: 'Hydrocortisone', image: '/images/cortef.png', price: 431.60, description: 'Reduces skin inflammation and itching.', dosage: 'Apply thinly to affected area twice daily.' },
  { id: 28, company: 'Zydus', companyImage: companyImageMap['Zydus'], brandName: 'Zyceva', formula: 'Erlotinib', image: '/images/zyceva.png', price: 439.90, description: 'Used in cancer treatment.', dosage: '1 tablet daily on an empty stomach.' },
  { id: 29, company: 'Win-Medicare', companyImage: companyImageMap['Win-Medicare'], brandName: 'Betadine', formula: 'Povidone-Iodine', image: '/images/betadine.png', price: 315.40, description: 'Antiseptic for minor cuts and wounds.', dosage: 'Apply to affected area 2-3 times daily.' },
  { id: 30, company: 'Glenmark', companyImage: companyImageMap['Glenmark'], brandName: 'Candid', formula: 'Clotrimazole Cream', image: '/images/candid.png', price: 406.70, description: 'Treats fungal skin infections.', dosage: 'Apply twice daily for 2-4 weeks.' },
  { id: 31, company: 'Bayer', companyImage: companyImageMap['Bayer'], brandName: 'Canesten', formula: 'Clotrimazole Cream', image: '/images/canesten.png', price: 415.00, description: 'For athlete’s foot and ringworm.', dosage: 'Apply to affected area twice daily.' },
  { id: 32, company: 'Piramal', companyImage: companyImageMap['Piramal'], brandName: 'Caladryl', formula: 'Calamine Lotion', image: '/images/caladryl.png', price: 265.60, description: 'Soothes itching and skin irritation.', dosage: 'Apply 2-3 times daily on affected area.' },
  { id: 33, company: 'Nykaa', companyImage: companyImageMap['Nykaa'], brandName: 'Wanderlust Body Lotion', formula: 'Mediterranean sea salt', image: '/images/nykaalotion.png', price: 273.90, description: 'Moisturizes and refreshes skin.', dosage: 'Apply as needed after bathing.' },
  { id: 34, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Becosules', formula: 'Multivitamins', image: '/images/becosules.png', price: 830.00, description: 'Supports overall health and immunity.', dosage: '1 capsule daily after meals.' },
  { id: 35, company: 'Bayer', companyImage: companyImageMap['Bayer'], brandName: 'Supradyn', formula: 'Multivitamins', image: '/images/supradyn.png', price: 846.60, description: 'Daily multivitamin for energy and immunity.', dosage: '1 tablet daily with water.' },
  { id: 36, company: 'Abbott', companyImage: companyImageMap['Abbott'], brandName: 'Livogen', formula: 'Iron + Folic Acid', image: '/images/livogen.png', price: 564.40, description: 'Treats anemia and supports pregnancy.', dosage: '1 tablet daily.' },
  { id: 37, company: 'Macleods', companyImage: companyImageMap['Macleods'], brandName: 'Irozorb', formula: 'Iron + Folic Acid', image: '/images/irozorb.png', price: 572.70, description: 'For iron deficiency anemia.', dosage: '1 tablet daily after meals.' },
  { id: 38, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Gelusil', formula: 'Antacids', image: '/images/gelusil.png', price: 332.00, description: 'Relieves heartburn and indigestion.', dosage: '2 tablets after meals.' },
  { id: 39, company: 'Abbott', companyImage: companyImageMap['Abbott'], brandName: 'Digene', formula: 'Antacids', image: '/images/digene.png', price: 340.30, description: 'For quick relief from acidity.', dosage: '2 tablets after meals.' },
  { id: 40, company: 'USV', companyImage: companyImageMap['USV'], brandName: 'Glycomet', formula: 'Metformin', image: '/images/glycomet.png', price: 498.00, description: 'Manages type 2 diabetes.', dosage: '1 tablet twice daily with meals.' },
  { id: 41, company: 'Franco-Indian', companyImage: companyImageMap['Franco-Indian'], brandName: 'Gluconorm', formula: 'Metformin', image: '/images/glyconorm.png', price: 514.60, description: 'Controls blood sugar levels.', dosage: '1 tablet daily with meals.' },
  { id: 42, company: 'Sanofi', companyImage: companyImageMap['Sanofi'], brandName: 'Amaryl', formula: 'Glimepiride', image: '/images/amaryl.png', price: 622.50, description: 'For type 2 diabetes management.', dosage: '1 tablet daily before breakfast.' },
  { id: 43, company: 'Glenmark', companyImage: companyImageMap['Glenmark'], brandName: 'Glinate', formula: 'Glimepiride', image: '/images/glinate.png', price: 605.90, description: 'Lowers blood sugar in diabetes.', dosage: '1 tablet daily.' },
  { id: 44, company: 'Micro Labs', companyImage: companyImageMap['Micro Labs'], brandName: 'Amlong', formula: 'Amlodipine', image: '/images/amlong.png', price: 415.00, description: 'Treats high blood pressure.', dosage: '1 tablet daily.' },
  { id: 45, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Amlip', formula: 'Amlodipine', image: '/images/amlip.png', price: 423.30, description: 'Manages hypertension and chest pain.', dosage: '1 tablet daily.' },
  { id: 46, company: 'Glenmark', companyImage: companyImageMap['Glenmark'], brandName: 'Telma', formula: 'Telmisartan', image: '/images/telma.png', price: 564.40, description: 'For hypertension management.', dosage: '1 tablet daily.' },
  { id: 47, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Telgard', formula: 'Telmisartan', image: '/images/telgard.png', price: 572.70, description: 'Controls high blood pressure.', dosage: '1 tablet daily.' },
  { id: 48, company: 'Torrent', companyImage: companyImageMap['Torrent'], brandName: 'Losar', formula: 'Losartan', image: '/images/losar.png', price: 539.50, description: 'Treats hypertension.', dosage: '1 tablet daily.' },
  { id: 49, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Repace', formula: 'Losartan', image: '/images/repace.png', price: 531.20, description: 'Manages blood pressure.', dosage: '1 tablet daily.' },
  { id: 50, company: 'Pfizer', companyImage: companyImageMap['Pfizer'], brandName: 'Lipitor', formula: 'Atorvastatin', image: '/images/lipitor.png', price: 664.00, description: 'Lowers cholesterol levels.', dosage: '1 tablet daily at night.' },
  { id: 51, company: 'Zydus', companyImage: companyImageMap['Zydus'], brandName: 'Atorva', formula: 'Atorvastatin', image: '/images/atorva.png', price: 655.70, description: 'For cholesterol management.', dosage: '1 tablet daily.' },
  { id: 52, company: 'AstraZeneca', companyImage: companyImageMap['AstraZeneca'], brandName: 'Crestor', formula: 'Rosuvastatin', image: '/images/crestor.png', price: 680.60, description: 'Reduces cholesterol levels.', dosage: '1 tablet daily.' },
  { id: 53, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Rozavel', formula: 'Rosuvastatin', image: '/images/rozavel.png', price: 688.90, description: 'Manages cholesterol levels.', dosage: '1 tablet daily at night.' },
  { id: 54, company: 'Abbott', companyImage: companyImageMap['Abbott'], brandName: 'Thyronorm', formula: 'Levothyroxine', image: '/images/thyronorm.png', price: 373.50, description: 'Treats hypothyroidism.', dosage: '1 tablet daily on an empty stomach.' },
  { id: 55, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'Eltroxin', formula: 'Levothyroxine', image: '/images/eltroxin.png', price: 381.80, description: 'For thyroid hormone replacement.', dosage: '1 tablet daily.' },
  { id: 56, company: "Dr. Reddy's", companyImage: companyImageMap["Dr. Reddy's"], brandName: 'Razo', formula: 'Rabeprazole', image: '/images/razo.png', price: 473.10, description: 'Treats acid reflux and ulcers.', dosage: '1 tablet daily before meals.' },
  { id: 57, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Rabicip', formula: 'Rabeprazole', image: '/images/rabicip.png', price: 464.80, description: 'For GERD and ulcer relief.', dosage: '1 tablet daily.' },
  { id: 58, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Pantocid', formula: 'Pantoprazole', image: '/images/pantocid.png', price: 415.00, description: 'Reduces stomach acid.', dosage: '1 tablet daily before breakfast.' },
  { id: 59, company: 'Alkem', companyImage: companyImageMap['Alkem'], brandName: 'Pan 40', formula: 'Pantoprazole', image: '/images/pan40.png', price: 406.70, description: 'For acid reflux relief.', dosage: '1 tablet daily.' },
  { id: 60, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Montek LC', formula: 'Montelukast', image: '/images/monteklc.png', price: 498.00, description: 'Manages asthma and allergies.', dosage: '1 tablet daily at night.' },
  { id: 61, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Montair-10', formula: 'Montelukast', image: '/images/montair10.png', price: 489.70, description: 'For allergic rhinitis and asthma.', dosage: '1 tablet daily.' },
  { id: 62, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Levorid', formula: 'Levocetirizine', image: '/images/levorid.png', price: 315.40, description: 'Relieves allergy symptoms.', dosage: '1 tablet daily at bedtime.' },
  { id: 63, company: 'Mankind', companyImage: companyImageMap['Mankind'], brandName: 'Lecope', formula: 'Levocetirizine', image: '/images/Lecope.png', price: 307.10, description: 'For seasonal allergies.', dosage: '1 tablet daily.' },
  { id: 64, company: 'Abbott', companyImage: companyImageMap['Abbott'], brandName: 'Protussa', formula: 'Dextromethrphan + Chlorpheniramine', image: '/images/protussa.png', price: 249.00, description: 'Relieves allergy symptoms.', dosage: '1 tablet every 4-6 hours.' },
  { id: 65, company: 'Sanofi', companyImage: companyImageMap['Sanofi'], brandName: 'Allerga', formula: 'Chlorpheniramine', image: '/images/allegra.png', price: 257.30, description: 'For allergic reactions.', dosage: '1 tablet every 6 hours.' },
  { id: 66, company: 'Alembic', companyImage: companyImageMap['Alembic'], brandName: 'Glycodin', formula: 'Guaifenesin', image: '/images/glycodin.png', price: 373.50, description: 'Loosens mucus in chest.', dosage: '10ml every 4 hours.' },
  { id: 67, company: 'Glenmark', companyImage: companyImageMap['Glenmark'], brandName: 'Ascoril', formula: 'Guaifenesin', image: '/images/ascoril.png', price: 381.80, description: 'For productive cough relief.', dosage: '10ml every 6 hours.' },
  { id: 68, company: 'GSK', companyImage: companyImageMap['GSK'], brandName: 'T-Bact', formula: 'Mupirocin', image: '/images/tbact.png', price: 456.50, description: 'Treats bacterial skin infections.', dosage: 'Apply to affected area 3 times daily.' },
  { id: 69, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Olox-OZ', formula: 'Ofloxacin + Ornidazole', image: '/images/olox.png', price: 581.00, description: 'For mixed infections.', dosage: '1 tablet twice daily.' },
  { id: 70, company: 'Macleods', companyImage: companyImageMap['Macleods'], brandName: 'Oflomac-OZ', formula: 'Ofloxacin + Ornidazole', image: '/images/oflomac.png', price: 572.70, description: 'Treats bacterial and protozoal infections.', dosage: '1 tablet twice daily.' },
  { id: 71, company: 'Sun Pharma', companyImage: companyImageMap['Sun Pharma'], brandName: 'Cifran', formula: 'Ciprofloxacin', image: '/images/cifran.png', price: 539.50, description: 'Antibiotic for various infections.', dosage: '1 tablet twice daily for 7-14 days.' },
  { id: 72, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Ciplox', formula: 'Ciprofloxacin', image: '/images/ciplox.png', price: 531.20, description: 'For urinary tract and respiratory infections.', dosage: '1 tablet twice daily.' },
  { id: 73, company: 'ICPA', companyImage: companyImageMap['ICPA'], brandName: 'Hexidine', formula: 'Chlorhexidine Mouthwash', image: '/images/hexidine.png', price: 290.50, description: 'For oral hygiene and gum infections.', dosage: 'Rinse with 10ml twice daily.' },
  { id: 74, company: "Dr. Reddy's", companyImage: companyImageMap["Dr. Reddy's"], brandName: 'Clohex', formula: 'Chlorhexidine Mouthwash', image: '/images/clohex.png', price: 298.80, description: 'Prevents plaque and gingivitis.', dosage: 'Rinse with 10ml twice daily.' },
  { id: 75, company: 'Allergan', companyImage: companyImageMap['Allergan'], brandName: 'Refresh Tears', formula: 'Carboxymethylcellulose', image: '/images/refreshtears.png', price: 664.00, description: 'Lubricates dry eyes.', dosage: '1-2 drops in each eye as needed.' },
  { id: 76, company: 'Cipla', companyImage: companyImageMap['Cipla'], brandName: 'Add Tears', formula: 'Carboxymethylcellulose', image: '/images/addtears.png', price: 647.40, description: 'Relieves dry eye symptoms.', dosage: '1 drop in each eye 3-4 times daily.' },
  { id: 77, company: 'Novartis', companyImage: companyImageMap['Novartis'], brandName: 'Voveran Gel', formula: 'Diclofenac Gel', image: '/images/voveran.png', price: 398.40, description: 'Relieves joint and muscle pain.', dosage: 'Apply to affected area 3-4 times daily.' },
  { id: 78, company: 'Troikaa', companyImage: companyImageMap['Troikaa'], brandName: 'Dynapar Gel', formula: 'Diclofenac Gel', image: '/images/dynapar.png', price: 406.70, description: 'For localized pain relief.', dosage: 'Apply thinly 3-4 times daily.' },
  { id: 79, company: 'Zandu', companyImage: companyImageMap['Zandu'], brandName: 'Zandu Balm', formula: 'Pain Relief Balm', image: '/images/zandubalm.png', price: 290.50, description: 'Relieves headache and body ache.', dosage: 'Apply to affected area as needed.' },
  { id: 80, company: 'Zandu', companyImage: companyImageMap['Zandu'], brandName: 'Zandu Chyavanprash', formula: 'Chyavanprash', image: '/images/chvanprash.png', price: 664.00, description: 'Boosts immunity and overall health.', dosage: '1-2 teaspoons daily.' },
  { id: 81, company: 'Vicks', companyImage: companyImageMap['Vicks'], brandName: 'Vicks VapoRub', formula: 'Vaporizing Ointment', image: '/images/vaporub.png', price: 348.60, description: 'Relieves cough and cold symptoms.', dosage: 'Apply to chest and throat as needed.' },
  { id: 82, company: 'Vicks', companyImage: companyImageMap['Vicks'], brandName: 'Vicks Action 500', formula: 'Cold and Flu Relief', image: '/images/action500.png', price: 415.00, description: 'For cold and flu symptom relief.', dosage: '1 tablet every 6 hours.' },
];

// Doctors data (without images)
const doctors = [
  { name: 'Dr. John Smith', specialty: 'Cardiologist' },
  { name: 'Dr. Sarah Johnson', specialty: 'Pediatrician' },
  { name: 'Dr. Michael Brown', specialty: 'Neurologist' },
  { name: 'Dr. Emily Davis', specialty: 'Dermatologist' },
  { name: 'Dr. Robert Wilson', specialty: 'Orthopedic Surgeon' },
  { name: 'Dr. Linda Taylor', specialty: 'General Physician' },
  { name: 'Dr. Priya Sharma', specialty: 'Gynecologist' },
  { name: 'Dr. Amit Patel', specialty: 'ENT Specialist' },
  { name: 'Dr. Sophia Lee', specialty: 'Ophthalmologist' },
  { name: 'Dr. James Carter', specialty: 'Psychiatrist' },
  { name: 'Dr. Anjali Gupta', specialty: 'Gastroenterologist' },
  { name: 'Dr. David Kim', specialty: 'Endocrinologist' },
  { name: 'Dr. Ravi Kumar', specialty: 'Urologist' },
  { name: 'Dr. Maria Gonzalez', specialty: 'Pulmonologist' },
  { name: 'Dr. Neha Verma', specialty: 'Rheumatologist' },
  { name: 'Dr. William Harris', specialty: 'Oncologist' },
  { name: 'Dr. Sanjay Mehta', specialty: 'Nephrologist' },
  { name: 'Dr. Clara Adams', specialty: 'Anesthesiologist' },
  { name: 'Dr. Vikram Singh', specialty: 'Diabetologist' },
  { name: 'Dr. Emma Thompson', specialty: 'Surgeon' },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas (medica database)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to seed both medicines and doctors
const seedDatabase = async () => {
  try {
    // Seed Medicines
    await Medicine.deleteMany(); // Clear existing medicines
    await Medicine.insertMany(medicines);
    console.log('Medicines seeded successfully');

    // Seed Doctors
    await Doctor.deleteMany(); // Clear existing doctors
    await Doctor.insertMany(doctors);
    console.log('Doctors seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDatabase();