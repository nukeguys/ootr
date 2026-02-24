import yaml
import sys

def yaml_to_mermaid(path):
    with open(path) as f:
        domain = yaml.safe_load(f)

    lines = ["erDiagram"]

    card_map = {
        "1:1": "||--||", "1:N": "||--o{",
        "N:1": "}o--||", "N:M": "}o--o{"
    }

    # 관계
    for rel in domain.get("relationships", []):
        status = rel.get("status", "confirmed")
        if status == "TBD":
            continue  # TBD 관계는 다이어그램에서 제외
        card = card_map.get(rel.get("card", ""), "||--||")
        lines.append(f'    {rel["from"]} {card} {rel["to"]} : {rel["type"]}')

    # 엔티티 속성
    for name, entity in domain.get("entities", {}).items():
        props = entity.get("props", {})
        if isinstance(props, dict):
            lines.append(f"    {name} {{")
            for prop_name, prop_type in props.items():
                if isinstance(prop_type, dict):
                    prop_type = prop_type.get("type", "???")
                lines.append(f"        {prop_type} {prop_name}")
            lines.append("    }")

    print("\n".join(lines))

if __name__ == "__main__":
    yaml_to_mermaid(sys.argv[1])