#!/usr/bin/env python3
import json
import re

def create_deelvragen(vraag_data):
    """Create sub-questions based on the main question and hoofdpunten"""

    # Extract key concepts from the question
    vraag_text = vraag_data['vraag']
    hoofdpunten = vraag_data.get('antwoordrichting', {}).get('hoofdpunten', [])
    kernconcepten = vraag_data.get('kernconcepten', [])
    thema = vraag_data.get('thema', '')

    deelvragen = []

    # Create sub-questions based on hoofdpunten if available
    if hoofdpunten:
        # Question 1: Conceptual understanding
        if len(hoofdpunten) > 0 and kernconcepten:
            deelvraag = {
                "id": f"{vraag_data['id']}a",
                "vraag": f"Hoe definieer je {kernconcepten[0]} in de context van jullie bedrijf?",
                "type": "concept",
                "hints": [
                    f"Denk aan de definitie van {kernconcepten[0]}",
                    "Gebruik concrete voorbeelden uit jullie sector"
                ],
                "verwachtAntwoord": hoofdpunten[0] if hoofdpunten else f"Definieer {kernconcepten[0]} met praktijkvoorbeelden"
            }
            deelvragen.append(deelvraag)

        # Question 2: Context/Analysis
        if len(hoofdpunten) > 1:
            deelvraag = {
                "id": f"{vraag_data['id']}b",
                "vraag": extract_question_from_hoofdpunt(hoofdpunten[1], vraag_data),
                "type": "analyse",
                "hints": [
                    "Gebruik concrete cijfers waar mogelijk",
                    "Vergelijk met sectorgenoten"
                ],
                "verwachtAntwoord": hoofdpunten[1]
            }
            deelvragen.append(deelvraag)

        # Question 3: Application
        if len(hoofdpunten) > 2:
            deelvraag = {
                "id": f"{vraag_data['id']}c",
                "vraag": extract_question_from_hoofdpunt(hoofdpunten[2], vraag_data),
                "type": "toepassing",
                "hints": [
                    "Verbind theorie met praktijk",
                    "Geef specifieke voorbeelden"
                ],
                "verwachtAntwoord": hoofdpunten[2]
            }
            deelvragen.append(deelvraag)

        # Question 4: Implications/Strategy
        if len(hoofdpunten) > 3:
            deelvraag = {
                "id": f"{vraag_data['id']}d",
                "vraag": extract_question_from_hoofdpunt(hoofdpunten[3], vraag_data),
                "type": "implicatie",
                "hints": [
                    "Denk aan korte en lange termijn effecten",
                    "Overweeg verschillende scenario's"
                ],
                "verwachtAntwoord": hoofdpunten[3]
            }
            deelvragen.append(deelvraag)

    # Ensure we have at least 3 deelvragen
    while len(deelvragen) < 3:
        options = ["risico's", "kansen", "uitdagingen"]
        deelvragen.append({
            "id": f"{vraag_data['id']}{chr(97 + len(deelvragen))}",
            "vraag": f"Wat zijn de belangrijkste {options[len(deelvragen)]} in deze context?",
            "type": ["risico", "kans", "uitdaging"][len(deelvragen)],
            "hints": ["Wees specifiek", "Gebruik voorbeelden"],
            "verwachtAntwoord": "Identificeer en analyseer de belangrijkste punten"
        })

    return deelvragen

def extract_question_from_hoofdpunt(hoofdpunt, vraag_data):
    """Convert a hoofdpunt into a question"""

    # Remove leading/trailing whitespace
    hoofdpunt = hoofdpunt.strip()

    # Common patterns to convert statements to questions
    if "identificeren" in hoofdpunt.lower():
        return hoofdpunt.replace("Identificeren", "Welke").replace("identificeren", "identificeer je") + "?"
    elif "analyseren" in hoofdpunt.lower():
        return "Hoe " + hoofdpunt.lower() + "?"
    elif "effect" in hoofdpunt.lower():
        return "Wat is het " + hoofdpunt.lower() + "?"
    elif "verbinden" in hoofdpunt.lower() or "koppel" in hoofdpunt.lower():
        return "Hoe " + hoofdpunt.lower() + "?"
    elif hoofdpunt.startswith("Van ") or hoofdpunt.startswith("van "):
        return "Hoe verandert de situatie " + hoofdpunt.lower() + "?"
    else:
        # Default: turn into a "how" question
        return f"Hoe pas je '{hoofdpunt}' toe in jullie situatie?"

def create_vervolgvragen(vraag_data):
    """Create follow-up question templates"""

    rol = vraag_data.get('rol', '')
    thema = vraag_data.get('thema', '')
    kernconcepten = vraag_data.get('kernconcepten', [])

    vervolgvragen = {
        "clarification": [],
        "evidence": [],
        "perspective": [],
        "implications": []
    }

    # Clarification questions
    if kernconcepten:
        vervolgvragen["clarification"].append(f"Wat bedoel je precies met '{kernconcepten[0]}' in deze context?")
    vervolgvragen["clarification"].append("Kun je dat concreter maken met een voorbeeld uit jullie bedrijf?")
    vervolgvragen["clarification"].append("Hoe verschilt jullie aanpak van sectorgenoten?")

    # Evidence questions
    vervolgvragen["evidence"].append("Welke data uit jullie jaarverslag ondersteunt deze bewering?")
    vervolgvragen["evidence"].append("Heb je benchmarks met vergelijkbare bedrijven?")
    vervolgvragen["evidence"].append("Wat zijn de kwantitatieve indicatoren hiervoor?")

    # Perspective questions
    if "AFM" in rol:
        vervolgvragen["perspective"].append("Hoe kijkt DNB naar deze ontwikkeling?")
    elif "ACM" in rol:
        vervolgvragen["perspective"].append("Wat is het consumentenperspectief hierop?")
    elif "RvC" in rol:
        vervolgvragen["perspective"].append("Hoe reageren aandeelhouders op deze strategie?")
    else:
        vervolgvragen["perspective"].append("Wat vinden jullie belangrijkste stakeholders?")

    vervolgvragen["perspective"].append("Hoe positioneren concurrenten zich?")
    vervolgvragen["perspective"].append("Wat is de maatschappelijke impact?")

    # Implication questions
    vervolgvragen["implications"].append("Wat gebeurt er als deze trend zich doorzet?")
    vervolgvragen["implications"].append("Welke scenario's hebben jullie doorgerekend?")
    vervolgvragen["implications"].append("Hoe beïnvloedt dit jullie 5-jaar strategie?")

    return vervolgvragen

def transform_vragenbank(input_file, output_file):
    """Transform the entire vragenbank with deelvragen and vervolgvragen"""

    # Read the original file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Update metadata
    data['meta']['versie'] = '2.0'
    data['meta']['laatstBijgewerkt'] = '2025-01-10'
    data['meta']['wijzigingen'] = 'Uitbreiding met voorgedefinieerde deelvragen en vervolgvragen voor peer-to-peer learning'

    # Transform each question
    for i, vraag in enumerate(data['vragen']):
        print(f"Processing question {vraag['id']}: {vraag.get('thema', 'Unknown theme')}")

        # Add deelvragen
        vraag['deelvragen'] = create_deelvragen(vraag)

        # Add vervolgvragen
        vraag['vervolgvragen'] = create_vervolgvragen(vraag)

    # Write the transformed file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nTransformation complete!")
    print(f"Original: {input_file}")
    print(f"Output: {output_file}")
    print(f"Total questions processed: {len(data['vragen'])}")

if __name__ == "__main__":
    input_file = "/workspaces/bedrom/course-docs/toetsing/toetsing-vragenbank.json"
    output_file = "/workspaces/bedrom/course-docs/toetsing/toetsing-vragenbank-uitgebreid.json"

    transform_vragenbank(input_file, output_file)