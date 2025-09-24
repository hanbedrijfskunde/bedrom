#!/usr/bin/env python3
import json

# Theme-specific deelvraag templates
THEME_DEELVRAGEN = {
    "Macro-economische omgeving": [
        {"type": "concept", "template": "Hoe definieer je conjunctuurgevoeligheid voor jullie sector en is deze pro- of anticyclisch?"},
        {"type": "identificatie", "template": "Welke macro-economische indicatoren hebben de grootste impact op jullie bedrijfsresultaten?"},
        {"type": "analyse", "template": "Hoe werken kostenstijgingen door in jullie positie binnen de bedrijfskolom?"},
        {"type": "strategie", "template": "Welke mitigerende maatregelen nemen jullie tegen macro-economische schokken?"}
    ],
    "Economische kringloop": [
        {"type": "concept", "template": "Hoe past jullie bedrijf in de economische kringloop tussen huishoudens, bedrijven en overheid?"},
        {"type": "kwantificering", "template": "Wat is het directe effect op de consumptie (C) component van het BBP?"},
        {"type": "analyse", "template": "Welke multiplier effecten treden op door deze verandering?"},
        {"type": "implicatie", "template": "Hoe beïnvloedt dit de import/export balans (E-M)?"}
    ],
    "Marktvormen en macht": [
        {"type": "structuur", "template": "Welke marktvorm karakteriseert jullie sector het beste en waarom?"},
        {"type": "gedrag", "template": "Hoe reageren jullie op prijsstrategieën van concurrenten?"},
        {"type": "resultaat", "template": "Wat is het effect op consumer surplus en producer surplus?"},
        {"type": "dynamiek", "template": "Hoe veranderen toetredingsdrempels door technologische ontwikkelingen?"}
    ],
    "Prijselasticiteit": [
        {"type": "meting", "template": "Wat is de prijselasticiteit van jullie kernproducten (met berekening)?"},
        {"type": "segmentatie", "template": "Hoe verschillen elasticiteiten tussen verschillende klantsegmenten?"},
        {"type": "substitutie", "template": "Wat is de kruiselingse prijselasticiteit met substituten?"},
        {"type": "strategie", "template": "Hoe optimaliseren jullie de prijsstrategie gegeven deze elasticiteiten?"}
    ],
    "Innovatie en technologie": [
        {"type": "concept", "template": "Wat is jullie innovation rent en hoe lang is deze houdbaar?"},
        {"type": "bescherming", "template": "Hoe beschermen jullie technologische voorsprong tegen imitatie?"},
        {"type": "disruptie", "template": "Welke Schumpeteriaanse creatieve destructie bedreigt jullie businessmodel?"},
        {"type": "investering", "template": "Wat is jullie R&D intensiteit vergeleken met sectorgenoten?"}
    ],
    "Kostenstructuren": [
        {"type": "identificatie", "template": "Wat is de verhouding tussen vaste en variabele kosten in jullie kostenstructuur?"},
        {"type": "berekening", "template": "Bij welk productievolume bereiken jullie het break-even punt?"},
        {"type": "schaalvoordelen", "template": "Welke economies of scale realiseren jullie bij volumeverdubbeling?"},
        {"type": "optimalisatie", "template": "Hoe verschuift het optimale productiepunt bij veranderende inputprijzen?"}
    ],
    "Sociale dilemma's": [
        {"type": "identificatie", "template": "Welk prisoner's dilemma speelt in jullie sector?"},
        {"type": "analyse", "template": "Wat is het Nash equilibrium in deze situatie?"},
        {"type": "cooperatie", "template": "Welke mechanismen bevorderen coöperatie tussen marktpartijen?"},
        {"type": "oplossing", "template": "Hoe kan regulering het collectieve optimum bereiken?"}
    ],
    "Publieke goederen": [
        {"type": "concept", "template": "Welke aspecten van jullie product/dienst hebben publiek goed karakteristieken?"},
        {"type": "free-riding", "template": "Hoe gaan jullie om met het free-rider probleem?"},
        {"type": "financiering", "template": "Welk financieringsmechanisme is optimaal voor deze publieke aspecten?"},
        {"type": "regulering", "template": "Welke rol speelt de overheid in het waarborgen van toegang?"}
    ],
    "Externe effecten": [
        {"type": "identificatie", "template": "Welke negatieve externe effecten veroorzaakt jullie bedrijfsactiviteit?"},
        {"type": "kwantificering", "template": "Wat is het verschil tussen private kosten (MPC) en sociale kosten (MSC)?"},
        {"type": "deadweight", "template": "Hoe groot is het deadweight loss door deze externaliteit?"},
        {"type": "internalisering", "template": "Welke Pigouviaanse belasting zou de externaliteit internaliseren?"}
    ],
    "True pricing": [
        {"type": "berekening", "template": "Wat is de true price van jullie hoofdproduct inclusief alle externe kosten?"},
        {"type": "componenten", "template": "Welke sociale en milieu kosten zijn het grootst?"},
        {"type": "transparantie", "template": "Hoe communiceren jullie true pricing naar consumenten?"},
        {"type": "transitie", "template": "Wat is jullie strategie om naar true pricing te bewegen?"}
    ]
}

def get_thema_deelvragen(thema, vraag_id):
    """Get theme-specific deelvragen or generate default ones"""

    # Find best matching theme
    best_match = None
    for theme_key in THEME_DEELVRAGEN.keys():
        if theme_key.lower() in thema.lower() or thema.lower() in theme_key.lower():
            best_match = theme_key
            break

    if best_match:
        deelvragen = []
        for i, template in enumerate(THEME_DEELVRAGEN[best_match]):
            deelvragen.append({
                "id": f"{vraag_id}{chr(97 + i)}",
                "vraag": template["template"],
                "type": template["type"],
                "hints": get_hints_for_type(template["type"]),
                "verwachtAntwoord": get_expected_answer(template["type"], thema)
            })
        return deelvragen

    # Default deelvragen if no theme match
    return None

def get_hints_for_type(question_type):
    """Get appropriate hints based on question type"""

    hints_map = {
        "concept": ["Gebruik de economische theorie", "Pas toe op jullie specifieke context"],
        "identificatie": ["Wees specifiek en volledig", "Gebruik concrete voorbeelden"],
        "analyse": ["Toon causale verbanden", "Gebruik data waar mogelijk"],
        "kwantificering": ["Gebruik cijfers uit jaarverslag", "Maak berekening inzichtelijk"],
        "berekening": ["Toon je berekening stap voor stap", "Gebruik realistische aannames"],
        "strategie": ["Denk aan korte en lange termijn", "Overweeg verschillende scenario's"],
        "implicatie": ["Beschouw directe en indirecte effecten", "Denk aan stakeholder impact"],
        "structuur": ["Gebruik SGR-model of Porter", "Vergelijk met theorie"],
        "gedrag": ["Beschrijf concrete acties", "Verklaar onderliggende motivatie"],
        "resultaat": ["Kwantificeer waar mogelijk", "Beschouw winners en losers"],
        "dynamiek": ["Denk aan toekomstige ontwikkelingen", "Identificeer tipping points"],
        "segmentatie": ["Gebruik demografische/psychografische kenmerken", "Kwantificeer verschillen"],
        "substitutie": ["Identificeer alternatieven", "Bereken kruiselingse elasticiteit"],
        "bescherming": ["Denk aan juridische en praktische barrières", "Overweeg first-mover advantages"],
        "disruptie": ["Identificeer nieuwe technologieën", "Analyseer business model innovatie"],
        "investering": ["Vergelijk met sector benchmarks", "Toon ROI berekening"],
        "schaalvoordelen": ["Onderscheid economies of scale vs scope", "Kwantificeer kostendaling"],
        "optimalisatie": ["Gebruik marginale analyse", "Toon grafisch indien mogelijk"],
        "cooperatie": ["Identificeer win-win situaties", "Beschouw reputatie effecten"],
        "oplossing": ["Evalueer verschillende beleidsopties", "Weeg kosten tegen baten"],
        "free-riding": ["Identificeer wie profiteert zonder bij te dragen", "Bedenk uitsluitingsmechanismen"],
        "financiering": ["Vergelijk belasting vs gebruikersheffing", "Overweeg public-private partnerships"],
        "regulering": ["Analyseer marktfalen", "Evalueer overheidsingrijpen"],
        "deadweight": ["Bereken efficiëntieverlies", "Visualiseer met vraag/aanbod diagram"],
        "internalisering": ["Bereken optimale heffing", "Overweeg alternatieven zoals verhandelbare rechten"],
        "componenten": ["Categoriseer naar ESG dimensies", "Gebruik LCA methodologie"],
        "transparantie": ["Overweeg verschillende communicatiekanalen", "Test consumentenreactie"],
        "transitie": ["Stel realistische tijdlijn op", "Identificeer barrières en enablers"]
    }

    return hints_map.get(question_type, ["Wees specifiek", "Gebruik voorbeelden"])

def get_expected_answer(question_type, thema):
    """Generate expected answer guidance based on type and theme"""

    base_answers = {
        "concept": f"Definieer het kernbegrip binnen {thema} context met praktijkvoorbeelden",
        "identificatie": f"Identificeer alle relevante factoren in {thema} met prioritering",
        "analyse": f"Analyseer oorzaak-gevolg relaties binnen {thema} systematisch",
        "kwantificering": f"Kwantificeer impact met concrete cijfers relevant voor {thema}",
        "berekening": f"Presenteer stapsgewijze berekening met duidelijke aannames voor {thema}",
        "strategie": f"Formuleer strategische respons op {thema} met tijdshorizon",
        "implicatie": f"Beschrijf kort en lange termijn implicaties van {thema}",
        "structuur": f"Analyseer marktstructuur aspecten relevant voor {thema}",
        "gedrag": f"Beschrijf gedragspatronen en motivaties binnen {thema}",
        "resultaat": f"Evalueer uitkomsten en impact van {thema} op stakeholders",
        "dynamiek": f"Analyseer veranderingsprocessen en trends in {thema}"
    }

    return base_answers.get(question_type, f"Beantwoord vraag met focus op {thema}")

def enhance_vragenbank(file_path):
    """Enhance the deelvragen in the vragenbank with better quality"""

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    enhanced_count = 0
    for vraag in data['vragen']:
        thema = vraag.get('thema', '')
        vraag_id = vraag['id']

        # Try to get theme-specific deelvragen
        thema_deelvragen = get_thema_deelvragen(thema, vraag_id)

        if thema_deelvragen:
            # Keep existing deelvragen structure but enhance content
            if 'deelvragen' in vraag and len(vraag['deelvragen']) > 0:
                # Merge: keep structure but update content where better
                for i, deelvraag in enumerate(vraag['deelvragen'][:len(thema_deelvragen)]):
                    vraag['deelvragen'][i]['vraag'] = thema_deelvragen[i]['vraag']
                    vraag['deelvragen'][i]['type'] = thema_deelvragen[i]['type']
                    vraag['deelvragen'][i]['hints'] = thema_deelvragen[i]['hints']
                    vraag['deelvragen'][i]['verwachtAntwoord'] = thema_deelvragen[i]['verwachtAntwoord']
            else:
                vraag['deelvragen'] = thema_deelvragen

            enhanced_count += 1
            print(f"Enhanced question {vraag_id}: {thema}")

    # Save enhanced version
    output_path = file_path.replace('.json', '-enhanced.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nEnhancement complete!")
    print(f"Enhanced {enhanced_count} questions with theme-specific deelvragen")
    print(f"Output saved to: {output_path}")

    return output_path

if __name__ == "__main__":
    vragenbank_path = "/workspaces/bedrom/course-docs/toetsing/toetsing-vragenbank.json"
    enhance_vragenbank(vragenbank_path)