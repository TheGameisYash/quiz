export type Question = {
  id: number;
  part: 'A' | 'B';
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export const questions: Question[] = [
  {
    "id": 1,
    "part": "A",
    "topic": "General",
    "question": "The capital of Madhya Pradesh is:",
    "options": [
      "Indore",
      "Bhopal",
      "Gwalior",
      "Jabalpur"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 2,
    "part": "A",
    "topic": "General",
    "question": "कोण सा विटामिन रक्त के थक्के बनाने में सहायक होता है?",
    "options": [
      "विटामिन A",
      "विटामिन C",
      "विटामिन K",
      "विटामिन D"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 3,
    "part": "A",
    "topic": "General",
    "question": "‘CPU’ is the:",
    "options": [
      "Central Processing Unit",
      "Central Programming Unit",
      "Computer Processing Utility",
      "Central Power Unit"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 4,
    "part": "A",
    "topic": "General",
    "question": "नर्मदा नदी किस दिशा में बहती है?",
    "options": [
      "पूर्व से पश्चिम",
      "पश्चिम से पूर्व",
      "उत्तर से दक्षिण",
      "दक्षिण से उत्तर"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "id": 5,
    "part": "A",
    "topic": "General",
    "question": "Find the value of: 25% of 320 = ?",
    "options": [
      "40",
      "60",
      "80",
      "100"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "id": 6,
    "part": "A",
    "topic": "General",
    "question": "‘Synonym’ of “Rapid” is:",
    "options": [
      "Slow",
      "Quick",
      "Late",
      "Dull"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 7,
    "part": "A",
    "topic": "General",
    "question": "“बाल मजदूरी” संबंध रखता है –",
    "options": [
      "शिक्षा से",
      "स्वास्थ्य से",
      "सामाजिक समस्या से",
      "पर्यावरण से"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 8,
    "part": "A",
    "topic": "General",
    "question": "Which gas is essential for respiration in humans?",
    "options": [
      "Nitrogen",
      "Oxygen",
      "Carbon dioxide",
      "Hydrogen"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 9,
    "part": "A",
    "topic": "General",
    "question": "“उनका” का स्त्रीलिंग रूप क्या होगा?",
    "options": [
      "उनका",
      "उनकी",
      "उनके",
      "उन"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 10,
    "part": "A",
    "topic": "General",
    "question": "Choose the correct spelling:",
    "options": [
      "Recieve",
      "Receive",
      "Recive",
      "Receeve"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 11,
    "part": "A",
    "topic": "General",
    "question": "भारत में पंचवर्षीय योजना कौन बनाता है?",
    "options": [
      "संसद",
      "योजना आयोग / नीति आयोग",
      "उच्च न्यायालय",
      "राष्ट्रपति अकेले"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 12,
    "part": "A",
    "topic": "General",
    "question": "3, 6, 12, 24, ?",
    "options": [
      "36",
      "40",
      "48",
      "60"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 13,
    "part": "A",
    "topic": "General",
    "question": "Light year is the unit of:",
    "options": [
      "Time",
      "Distance",
      "Speed",
      "Intensity"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 14,
    "part": "A",
    "topic": "General",
    "question": "“कठिन” का विलोम (Antonym) क्या है?",
    "options": [
      "सरल",
      "भारी",
      "बड़ा",
      "लंबा"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 15,
    "part": "A",
    "topic": "General",
    "question": "Simple interest on 2000 रुपये at 10% per annum for 2 years is:",
    "options": [
      "200",
      "300",
      "400",
      "500"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "id": 16,
    "part": "A",
    "topic": "General",
    "question": "In the human body, RBCs are formed mainly in:",
    "options": [
      "Liver",
      "Spleen",
      "Bone marrow",
      "Kidney"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 17,
    "part": "A",
    "topic": "General",
    "question": "“He is looking for a job.” – Choose correct passive form:",
    "options": [
      "A job is looked for by him",
      "A job was looked for by him",
      "A job is being looked for by him",
      "A job has been looked for by him"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 18,
    "part": "A",
    "topic": "General",
    "question": "पर्यावरण दिवस कब मनाया जाता है?",
    "options": [
      "5 जून",
      "14 नवम्बर",
      "1 मई",
      "2 अक्टूबर"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 19,
    "part": "A",
    "topic": "General",
    "question": "Which one is NOT a web browser?",
    "options": [
      "Chrome",
      "Firefox",
      "MS Word",
      "Edge"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "id": 20,
    "part": "A",
    "topic": "General",
    "question": "“मध्यप्रदेश का हृदय” किस शहर को कहा जाता है?",
    "options": [
      "भोपाल",
      "जबलपुर",
      "सागर",
      "इंदौर"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 21,
    "part": "A",
    "topic": "General",
    "question": "Boiling point of pure water at sea level is:",
    "options": [
      "0°C",
      "50°C",
      "100°C",
      "150°C"
    ],
    "answer": 0,
    "explanation": ""
  },
  {
    "id": 22,
    "part": "A",
    "topic": "General",
    "question": "सही वाक्य चुनिए –",
    "options": [
      "वह जा रहा हैं।",
      "वह जा रहे है।",
      "वह जा रहा है।",
      "वह जा रहा हूँ।"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 23,
    "part": "A",
    "topic": "General",
    "question": "“UNICEF” works mainly for:",
    "options": [
      "Farmers",
      "Children",
      "Soldiers",
      "Old people"
    ],
    "answer": 2,
    "explanation": ""
  },
  {
    "id": 24,
    "part": "A",
    "topic": "General",
    "question": "9 × 12 ÷ 6 = ?",
    "options": [
      "9",
      "12",
      "18",
      "24"
    ],
    "answer": 1,
    "explanation": ""
  },
  {
    "id": 25,
    "part": "B",
    "topic": "Technical",
    "question": "Functional unit of kidney is:",
    "options": [
      "Nephron",
      "Neuron",
      "Alveolus",
      "Neurilemma"
    ],
    "answer": 0,
    "explanation": "Nephron is the functional unit of kidney (filtration, reabsorption, secretion)."
  },
  {
    "id": 26,
    "part": "B",
    "topic": "Technical",
    "question": "कितने किडनी सामान्य मनुष्य में पायी जाती हैं?",
    "options": [
      "एक",
      "दो",
      "तीन",
      "चार"
    ],
    "answer": 1,
    "explanation": "Normal human has two kidneys."
  },
  {
    "id": 27,
    "part": "B",
    "topic": "Technical",
    "question": "Normal GFR in a healthy adult is about:",
    "options": [
      "10 ml/min",
      "50 ml/min",
      "120 ml/min",
      "250 ml/min"
    ],
    "answer": 2,
    "explanation": "Normal GFR ≈ 120 ml/min in healthy adult."
  },
  {
    "id": 28,
    "part": "B",
    "topic": "Technical",
    "question": "Which hormone is mainly produced by kidney?",
    "options": [
      "Insulin",
      "Erythropoietin",
      "Thyroxine",
      "Adrenaline"
    ],
    "answer": 1,
    "explanation": "Kidney produces erythropoietin (stimulates RBCs)."
  },
  {
    "id": 29,
    "part": "B",
    "topic": "Technical",
    "question": "Renin is secreted from:",
    "options": [
      "Juxtaglomerular cells",
      "Podocytes",
      "Hepatocytes",
      "Neurons"
    ],
    "answer": 0,
    "explanation": "Renin from juxtaglomerular cells (RAAS)."
  },
  {
    "id": 30,
    "part": "B",
    "topic": "Technical",
    "question": "मुख्य रूप से रक्त का छन्नन (filtration) कहाँ होता है?",
    "options": [
      "लूप ऑफ हेनले",
      "बोमैन कैप्सूल",
      "कलेक्टिंग डक्ट",
      "यूरिटर"
    ],
    "answer": 1,
    "explanation": "Filtration occurs in glomerulus into Bowman’s capsule."
  },
  {
    "id": 31,
    "part": "B",
    "topic": "Technical",
    "question": "Aldosterone acts mainly on:",
    "options": [
      "Glomerulus",
      "Proximal tubule",
      "Distal tubule and collecting duct",
      "Urethra"
    ],
    "answer": 2,
    "explanation": "Aldosterone acts on distal tubule and collecting duct (Na⁺ retention, K⁺ loss)."
  },
  {
    "id": 32,
    "part": "B",
    "topic": "Technical",
    "question": "Acute kidney injury is usually of duration:",
    "options": [
      "Hours to days",
      "Months to years",
      "Life long",
      "Only in childhood"
    ],
    "answer": 0,
    "explanation": "AKI develops over hours–days."
  },
  {
    "id": 33,
    "part": "B",
    "topic": "Technical",
    "question": "CKD का full form क्या है?",
    "options": [
      "Chronic kidney damage",
      "Chronic kidney disease",
      "Complete kidney disease",
      "Combined kidney disorder"
    ],
    "answer": 1,
    "explanation": "CKD = Chronic kidney disease."
  },
  {
    "id": 34,
    "part": "B",
    "topic": "Technical",
    "question": "Earliest sign of diabetic nephropathy:",
    "options": [
      "Macroalbuminuria",
      "Microalbuminuria",
      "Hematuria",
      "Anuria"
    ],
    "answer": 1,
    "explanation": "Earliest sign is microalbuminuria in diabetes."
  },
  {
    "id": 35,
    "part": "B",
    "topic": "Technical",
    "question": "“Uremia” refers to:",
    "options": [
      "Sugar in urine",
      "Protein in urine",
      "Nitrogenous waste retention with symptoms",
      "Pus in urine"
    ],
    "answer": 2,
    "explanation": "Uremia = retention of nitrogenous waste with symptoms."
  },
  {
    "id": 36,
    "part": "B",
    "topic": "Technical",
    "question": "Absolute indication for emergency dialysis in AKI:",
    "options": [
      "Mild anemia",
      "Refractory hyperkalemia",
      "Simple UTI",
      "Mild edema"
    ],
    "answer": 1,
    "explanation": "Refractory hyperkalemia is emergency indication for dialysis."
  },
  {
    "id": 37,
    "part": "B",
    "topic": "Technical",
    "question": "Hemodialysis removes solutes mainly by:",
    "options": [
      "Osmosis",
      "Diffusion",
      "Active transport",
      "Endocytosis"
    ],
    "answer": 1,
    "explanation": "HD removes small solutes mainly by diffusion."
  },
  {
    "id": 38,
    "part": "B",
    "topic": "Technical",
    "question": "Principle of hemofiltration is mainly:",
    "options": [
      "Convection",
      "Radiation",
      "Conduction",
      "Reflection"
    ],
    "answer": 0,
    "explanation": "Hemofiltration works mainly by convection."
  },
  {
    "id": 39,
    "part": "B",
    "topic": "Technical",
    "question": "In hemodialysis, blood and dialysate are separated by:",
    "options": [
      "Thick wall",
      "Semipermeable membrane",
      "Metal plate",
      "Glass wall"
    ],
    "answer": 1,
    "explanation": "Blood and dialysate separated by semipermeable membrane."
  },
  {
    "id": 40,
    "part": "B",
    "topic": "Technical",
    "question": "सामान्य hemodialysis सत्र की अवधि लगभग कितनी रहती है?",
    "options": [
      "30 मिनट",
      "1 घंटा",
      "3–4 घंटे",
      "10 घंटे"
    ],
    "answer": 2,
    "explanation": "Typical HD session lasts about 3–4 hours."
  },
  {
    "id": 41,
    "part": "B",
    "topic": "Technical",
    "question": "Frequency of maintenance HD in most ESRD patients:",
    "options": [
      "Once a week",
      "Twice a week",
      "Thrice a week",
      "Once a month"
    ],
    "answer": 2,
    "explanation": "Most ESRD patients dialyze three times a week."
  },
  {
    "id": 42,
    "part": "B",
    "topic": "Technical",
    "question": "In peritoneal dialysis, the dialyzing membrane is:",
    "options": [
      "Artificial dialyzer",
      "Skin",
      "Peritoneum",
      "Pleura"
    ],
    "answer": 2,
    "explanation": "In PD, peritoneum acts as dialysis membrane."
  },
  {
    "id": 43,
    "part": "B",
    "topic": "Technical",
    "question": "CAPD का full form क्या选 है?",
    "options": [
      "Continuous ambulatory peritoneal dialysis",
      "Chronic acute peritoneal dialysis",
      "Complete artificial peritoneal dialysis",
      "Central ambulatory plasma dialysis"
    ],
    "answer": 0,
    "explanation": "CAPD = Continuous ambulatory peritoneal dialysis."
  },
  {
    "id": 44,
    "part": "B",
    "topic": "Technical",
    "question": "An arteriovenous fistula is:",
    "options": [
      "Artery to nerve",
      "Artery to vein",
      "Vein to vein",
      "Artery to muscle"
    ],
    "answer": 1,
    "explanation": "AV fistula connects artery to vein."
  },
  {
    "id": 45,
    "part": "B",
    "topic": "Technical",
    "question": "AV fistula सबसे अधिक कहाँ बनाई जाती है?",
    "options": [
      "Femoral region",
      "Radio‑cephalic at wrist",
      "Carotid‑jugular",
      "Axillary"
    ],
    "answer": 1,
    "explanation": "Preferred site: radio‑cephalic fistula at wrist."
  },
  {
    "id": 46,
    "part": "B",
    "topic": "Technical",
    "question": "Temporary vascular access for HD is usually:",
    "options": [
      "Glass tube",
      "Double‑lumen venous catheter",
      "Simple IV cannula",
      "Arterial line only"
    ],
    "answer": 1,
    "explanation": "Temporary access: double‑lumen venous catheter."
  },
  {
    "id": 47,
    "part": "B",
    "topic": "Technical",
    "question": "The usual anticoagulant used in HD circuit:",
    "options": [
      "Warfarin",
      "Heparin",
      "Aspirin",
      "Streptokinase"
    ],
    "answer": 1,
    "explanation": "Heparin is standard anticoagulant in HD circuit."
  },
  {
    "id": 48,
    "part": "B",
    "topic": "Technical",
    "question": "Heparin is contraindicated in:",
    "options": [
      "Active bleeding",
      "Fever only",
      "Diabetes only",
      "Mild anemia only"
    ],
    "answer": 0,
    "explanation": "Active bleeding is major contraindication for heparin."
  },
  {
    "id": 49,
    "part": "B",
    "topic": "Technical",
    "question": "“Dry weight” means:",
    "options": [
      "Weight without clothes",
      "Weight after removing all extra fluid without hypotension",
      "Weight before first dialysis",
      "Birth weight"
    ],
    "answer": 1,
    "explanation": "Dry weight = weight after removing extra fluid without hypotension."
  },
  {
    "id": 50,
    "part": "B",
    "topic": "Technical",
    "question": "A common cause of intradialytic hypotension:",
    "options": [
      "Very slow UF",
      "Excessive UF / rapid fluid removal",
      "High dialysate sodium",
      "No fluid removal"
    ],
    "answer": 1,
    "explanation": "Excessive/rapid UF commonly causes intradialytic hypotension."
  },
  {
    "id": 51,
    "part": "B",
    "topic": "Technical",
    "question": "First step in severe hypotension during HD:",
    "options": [
      "Increase UF rate",
      "Stop UF, lower head/raise legs, check BP",
      "Stop all alarms",
      "Send patient home"
    ],
    "answer": 1,
    "explanation": "First: stop UF, legs up, check BP, then give saline if needed."
  },
  {
    "id": 52,
    "part": "B",
    "topic": "Technical",
    "question": "HD machine का कौन सा भाग air bubbles detect करता है?",
    "options": [
      "Blood pump",
      "Air detector",
      "Heater",
      "Power supply"
    ],
    "answer": 1,
    "explanation": "Air detector identifies air in venous line."
  },
  {
    "id": 53,
    "part": "B",
    "topic": "Technical",
    "question": "Main process used in water treatment for HD to remove dissolved salts:",
    "options": [
      "Simple filtration",
      "Reverse osmosis",
      "Sedimentation",
      "Distillation only"
    ],
    "answer": 1,
    "explanation": "Reverse osmosis used to remove dissolved salts in water treatment."
  },
  {
    "id": 54,
    "part": "B",
    "topic": "Technical",
    "question": "High calcium or magnesium in dialysate water is mainly due to:",
    "options": [
      "Bacteria",
      "Hardness of water",
      "Virus",
      "Chlorination"
    ],
    "answer": 1,
    "explanation": "High Ca/Mg due to water hardness."
  },
  {
    "id": 55,
    "part": "B",
    "topic": "Technical",
    "question": "Which infection is a major risk in dialysis units?",
    "options": [
      "Hepatitis B",
      "Cholera",
      "Malaria",
      "Rabies"
    ],
    "answer": 0,
    "explanation": "Hepatitis B is major infection risk in dialysis units."
  },
  {
    "id": 56,
    "part": "B",
    "topic": "Technical",
    "question": "Ideal vaccination for HD patients and staff:",
    "options": [
      "Hepatitis B vaccine",
      "Rabies vaccine",
      "Typhoid vaccine",
      "Measles vaccine"
    ],
    "answer": 0,
    "explanation": "Hepatitis B vaccination essential for patients and staff."
  },
  {
    "id": 57,
    "part": "B",
    "topic": "Technical",
    "question": "Dialysis disequilibrium syndrome occurs usually:",
    "options": [
      "After very slow dialysis",
      "After very rapid first dialysis in severe uremia",
      "In normal person",
      "Only in PD"
    ],
    "answer": 1,
    "explanation": "Disequilibrium: rapid first dialysis in severe uremia."
  },
  {
    "id": 58,
    "part": "B",
    "topic": "Technical",
    "question": "Symptom NOT typical of dialysis disequilibrium:",
    "options": [
      "Headache",
      "Nausea",
      "Convulsions",
      "Fracture of bone"
    ],
    "answer": 3,
    "explanation": "Fracture is not a typical feature of disequilibrium syndrome."
  },
  {
    "id": 59,
    "part": "B",
    "topic": "Technical",
    "question": "A common symptom of fluid overload in CKD patient:",
    "options": [
      "Weight loss",
      "Pedal edema and breathlessness",
      "Hair fall",
      "Skin rash only"
    ],
    "answer": 1,
    "explanation": "Fluid overload → pedal edema, breathlessness."
  },
  {
    "id": 60,
    "part": "B",
    "topic": "Technical",
    "question": "Erythropoietin deficiency in CKD mainly causes:",
    "options": [
      "Jaundice",
      "Anemia",
      "Diarrhea",
      "Fever"
    ],
    "answer": 1,
    "explanation": "EPO deficiency → anemia in CKD."
  },
  {
    "id": 61,
    "part": "B",
    "topic": "Technical",
    "question": "Before starting HD, which test is most important for safety?",
    "options": [
      "Blood group",
      "Serum potassium",
      "Serum amylase",
      "Lipid profile"
    ],
    "answer": 1,
    "explanation": "Serum potassium very important before dialysis."
  },
  {
    "id": 62,
    "part": "B",
    "topic": "Technical",
    "question": "‘Reuse’ of dialyzer means:",
    "options": [
      "Use on many patients",
      "Same patient after proper cleaning and disinfection",
      "Throw after one use",
      "Use without washing"
    ],
    "answer": 1,
    "explanation": "Reuse = same patient’s dialyzer after proper reprocessing."
  },
  {
    "id": 63,
    "part": "B",
    "topic": "Technical",
    "question": "Dialyzer reprocessing में क्या अनिवार्य है?",
    "options": [
      "Proper labeling with patient name",
      "Use on any patient",
      "No testing",
      "Store in open air"
    ],
    "answer": 0,
    "explanation": "Proper labeling with patient name is mandatory."
  },
  {
    "id": 64,
    "part": "B",
    "topic": "Technical",
    "question": "Acute complication of HD due to air in venous line:",
    "options": [
      "Air embolism",
      "Hemorrhage",
      "Hypoglycemia",
      "Arthritis"
    ],
    "answer": 0,
    "explanation": "Air in venous line → air embolism."
  },
  {
    "id": 65,
    "part": "B",
    "topic": "Technical",
    "question": "To prevent air embolism, technician should:",
    "options": [
      "Keep venous chamber empty",
      "Ensure proper priming and functioning of air detector",
      "Increase pump speed suddenly",
      "Ignore small bubbles"
    ],
    "answer": 1,
    "explanation": "Prevention: proper priming and working air detector."
  },
  {
    "id": 66,
    "part": "B",
    "topic": "Technical",
    "question": "Common side effect of excessive heparin:",
    "options": [
      "Hypertension",
      "Bleeding",
      "Constipation",
      "Cough"
    ],
    "answer": 1,
    "explanation": "Excess heparin → bleeding."
  },
  {
    "id": 67,
    "part": "B",
    "topic": "Technical",
    "question": "Hemodialysis room cleaning protocol includes:",
    "options": [
      "No disinfection",
      "Regular surface disinfection with approved agents",
      "Water only",
      "Sand cleaning"
    ],
    "answer": 1,
    "explanation": "Surfaces must be regularly disinfected with approved agents."
  },
  {
    "id": 68,
    "part": "B",
    "topic": "Technical",
    "question": "Universal precautions include all EXCEPT:",
    "options": [
      "Wearing gloves",
      "Hand hygiene",
      "Recapping used needles by hand",
      "Proper disposal of sharps"
    ],
    "answer": 2,
    "explanation": "Recapping needles by hand is NOT universal precaution."
  },
  {
    "id": 69,
    "part": "B",
    "topic": "Technical",
    "question": "For needle stick injury, first action:",
    "options": [
      "Suck wound",
      "Wash with soap and water, encourage slight bleeding",
      "Apply bandage immediately without washing",
      "Ignore"
    ],
    "answer": 1,
    "explanation": "First wash with soap and water; allow slight bleeding."
  },
  {
    "id": 70,
    "part": "B",
    "topic": "Technical",
    "question": "सामान्यतः dialyzer की किस विशेषता से clearance तय होता है?",
    "options": [
      "रंग",
      "Surface area और permeability",
      "Weight",
      "Company name"
    ],
    "answer": 1,
    "explanation": "Clearance depends on surface area and permeability of dialyzer."
  },
  {
    "id": 71,
    "part": "B",
    "topic": "Technical",
    "question": "Bicarbonate dialysate is preferred because:",
    "options": [
      "Cheaper only",
      "Better physiological buffer",
      "Toxic",
      "No role"
    ],
    "answer": 1,
    "explanation": "Bicarbonate is more physiological buffer than acetate dialysate."
  },
  {
    "id": 72,
    "part": "B",
    "topic": "Technical",
    "question": "Hyperkalemia के ECG में क्या दिख सकता है?",
    "options": [
      "Tall peaked T waves",
      "Bradycardia only",
      "Flat T waves",
      "U waves"
    ],
    "answer": 0,
    "explanation": "Hyperkalemia shows tall peaked T waves on ECG."
  },
  {
    "id": 73,
    "part": "B",
    "topic": "Technical",
    "question": "सबसे अच्छा संकेत कि HD session में पर्याप्त fluid निकला है:",
    "options": [
      "Sudden severe hypotension",
      "Patient comfortable, BP near target, edema reduced",
      "Severe cramps",
      "Chest pain"
    ],
    "answer": 1,
    "explanation": "Adequate UF: patient comfortable, BP near target, edema reduced."
  },
  {
    "id": 74,
    "part": "B",
    "topic": "Technical",
    "question": "In PD, infection at catheter exit site is called:",
    "options": [
      "Peritonitis",
      "Exit‑site infection",
      "Sepsis",
      "Cellulitis only"
    ],
    "answer": 1,
    "explanation": "Exit‑site infection = infection at PD catheter exit."
  },
  {
    "id": 75,
    "part": "B",
    "topic": "Technical",
    "question": "Peritonitis symptom in PD patient:",
    "options": [
      "Clear dialysate",
      "Cloudy effluent with abdominal pain",
      "No pain",
      "Only cough"
    ],
    "answer": 1,
    "explanation": "Peritonitis: cloudy effluent + abdominal pain."
  },
  {
    "id": 76,
    "part": "B",
    "topic": "Technical",
    "question": "Dialysis catheter dressing change should be:",
    "options": [
      "In dirty room",
      "Using aseptic technique",
      "With bare hands only",
      "Without mask"
    ],
    "answer": 1,
    "explanation": "Dressing change must be with aseptic technique."
  },
  {
    "id": 77,
    "part": "B",
    "topic": "Technical",
    "question": "Hemodialysis में blood pump का कार्य क्या है?",
    "options": [
      "Water heat करना",
      "Blood को extracorporeal circuit में circulate करना",
      "Dialysate तैयार करना",
      "Air detect करना"
    ],
    "answer": 1,
    "explanation": "Blood pump circulates blood through extracorporeal circuit."
  },
  {
    "id": 78,
    "part": "B",
    "topic": "Technical",
    "question": "Before connecting patient, dialyzer and lines must be:",
    "options": [
      "Dry",
      "Properly primed with saline",
      "Filled with air",
      "Empty"
    ],
    "answer": 1,
    "explanation": "Lines and dialyzer must be primed with saline before use."
  },
  {
    "id": 79,
    "part": "B",
    "topic": "Technical",
    "question": "Main symptom of anemia in CKD:",
    "options": [
      "Joint swelling",
      "Fatigue and breathlessness on exertion",
      "Vomiting only",
      "Rash"
    ],
    "answer": 1,
    "explanation": "Anemia → fatigue, breathlessness on exertion."
  },
  {
    "id": 80,
    "part": "B",
    "topic": "Technical",
    "question": "In HD, blood flow rate is usually:",
    "options": [
      "10–20 ml/min",
      "50–100 ml/min",
      "200–350 ml/min",
      "800 ml/min"
    ],
    "answer": 2,
    "explanation": "Usual blood flow rate 200–350 ml/min."
  },
  {
    "id": 81,
    "part": "B",
    "topic": "Technical",
    "question": "UF (ultrafiltration) mainly removes:",
    "options": [
      "Solutes only",
      "Fluid (water) with some solute",
      "Only RBC",
      "Only platelets"
    ],
    "answer": 1,
    "explanation": "UF removes fluid (water) with some solutes."
  },
  {
    "id": 82,
    "part": "B",
    "topic": "Technical",
    "question": "Dialysate should be:",
    "options": [
      "Sterile blood",
      "Carefully prepared electrolyte solution",
      "Plain water",
      "Oil"
    ],
    "answer": 1,
    "explanation": "Dialysate is carefully prepared electrolyte solution."
  },
  {
    "id": 83,
    "part": "B",
    "topic": "Technical",
    "question": "CKD patient dietary advice usually includes:",
    "options": [
      "Unlimited salt",
      "Salt and fluid restriction as per order",
      "Only sweets",
      "No restriction ever"
    ],
    "answer": 1,
    "explanation": "CKD: salt and fluid restriction as ordered."
  },
  {
    "id": 84,
    "part": "B",
    "topic": "Technical",
    "question": "सबसे सामान्य कारण CKD का विश्व स्तर पर:",
    "options": [
      "Malaria",
      "Diabetes mellitus",
      "Snake bite",
      "Dengue"
    ],
    "answer": 1,
    "explanation": "Diabetes mellitus is leading cause of CKD worldwide."
  },
  {
    "id": 85,
    "part": "B",
    "topic": "Technical",
    "question": "Protein restriction in CKD mainly helps to:",
    "options": [
      "Increase urea",
      "Decrease nitrogenous waste production",
      "Increase GFR damage",
      "Cause obesity"
    ],
    "answer": 1,
    "explanation": "Protein restriction decreases nitrogenous waste production."
  },
  {
    "id": 86,
    "part": "B",
    "topic": "Technical",
    "question": "For AV fistula needle removal, technician should:",
    "options": [
      "Pull out and leave",
      "Apply firm pressure with sterile gauze",
      "Tape only, no pressure",
      "Wash only"
    ],
    "answer": 1,
    "explanation": "After needle removal, apply firm sterile pressure."
  },
  {
    "id": 87,
    "part": "B",
    "topic": "Technical",
    "question": "Bruit and thrill are checked in AV fistula to assess:",
    "options": [
      "Infection",
      "Patency and flow",
      "Fracture",
      "Edema"
    ],
    "answer": 1,
    "explanation": "Bruit and thrill show AV fistula patency and flow."
  },
  {
    "id": 88,
    "part": "B",
    "topic": "Technical",
    "question": "HD machine conductivity alarm generally relates to:",
    "options": [
      "Blood pressure",
      "Dialysate concentration",
      "Temperature of room",
      "ECG of patient"
    ],
    "answer": 1,
    "explanation": "Conductivity alarm relates to dialysate concentration."
  },
  {
    "id": 89,
    "part": "B",
    "topic": "Technical",
    "question": "During HD, sudden chest pain and shortness of breath may indicate:",
    "options": [
      "Air embolism or cardiac event",
      "Nail infection",
      "Gastritis only",
      "Skin allergy only"
    ],
    "answer": 0,
    "explanation": "Sudden chest pain + SOB may indicate air embolism/cardiac issue."
  },
  {
    "id": 90,
    "part": "B",
    "topic": "Technical",
    "question": "Which parameter is commonly used to assess dialysis adequacy?",
    "options": [
      "Hemoglobin",
      "Kt/V or URR",
      "Blood group",
      "ESR"
    ],
    "answer": 1,
    "explanation": "Dialysis adequacy: Kt/V or URR commonly used."
  },
  {
    "id": 91,
    "part": "B",
    "topic": "Technical",
    "question": "Reuse of dialyzer is generally not done in:",
    "options": [
      "Hepatitis B positive patients (by many protocols)",
      "Stable CKD patient",
      "Young patient",
      "Old patient"
    ],
    "answer": 0,
    "explanation": "Many centers do not reuse dialyzer in Hep B positive patients."
  },
  {
    "id": 92,
    "part": "B",
    "topic": "Technical",
    "question": "In HD unit, which waste goes in puncture‑proof container?",
    "options": [
      "Paper",
      "Used needles and sharps",
      "Food",
      "Water"
    ],
    "answer": 1,
    "explanation": "Used needles/sharps go into puncture‑proof (sharp) container."
  },
  {
    "id": 93,
    "part": "B",
    "topic": "Technical",
    "question": "Dialysis technician की महत्त्वपूर्ण जिम्मेदारी कौन‑सी है?",
    "options": [
      "Only payment collection",
      "Machine operation, monitoring, basic patient care under nephrologist",
      "Surgery करना",
      "Medicine prescribe करना"
    ],
    "answer": 1,
    "explanation": "Technician: machine operation, monitoring, basic care under nephrologist."
  },
  {
    "id": 94,
    "part": "B",
    "topic": "Technical",
    "question": "In case of power failure, first action:",
    "options": [
      "Leave patient",
      "Manually rotate blood pump if hand crank provided and clamp lines as per protocol",
      "Remove needles immediately without plan",
      "Nothing"
    ],
    "answer": 1,
    "explanation": "Power failure: use hand crank/clamp as per protocol, keep circuit safe."
  },
  {
    "id": 95,
    "part": "B",
    "topic": "Technical",
    "question": "Dialysate temperature normally set around:",
    "options": [
      "20°C",
      "25°C",
      "36–37°C",
      "45°C"
    ],
    "answer": 2,
    "explanation": "Dialysate temperature ≈ 36–37°C."
  },
  {
    "id": 96,
    "part": "B",
    "topic": "Technical",
    "question": "High dialysate temperature may cause:",
    "options": [
      "Hypothermia",
      "Vasodilation and hypotension",
      "Hypertension only",
      "No effect"
    ],
    "answer": 1,
    "explanation": "High dialysate temperature → vasodilation, hypotension."
  },
  {
    "id": 97,
    "part": "B",
    "topic": "Technical",
    "question": "Before each shift, machine disinfection status must be:",
    "options": [
      "Ignored",
      "Verified and documented as per protocol",
      "Asked from patient",
      "Not required"
    ],
    "answer": 1,
    "explanation": "Disinfection status must be verified and documented."
  },
  {
    "id": 98,
    "part": "B",
    "topic": "Technical",
    "question": "Which of the following is a chronic complication of long‑term HD?",
    "options": [
      "Disequilibrium syndrome",
      "Amyloidosis, bone disease",
      "Acute hemolysis",
      "Acute allergy"
    ],
    "answer": 1,
    "explanation": "Long‑term HD: amyloidosis, bone disease are chronic complications."
  },
  {
    "id": 99,
    "part": "B",
    "topic": "Technical",
    "question": "PD fluid bag before use should be:",
    "options": [
      "Cold",
      "Warmed to near body temperature as per instructions",
      "Boiled",
      "Frozen"
    ],
    "answer": 1,
    "explanation": "PD fluid bag is warmed to near body temperature before use."
  }
];
