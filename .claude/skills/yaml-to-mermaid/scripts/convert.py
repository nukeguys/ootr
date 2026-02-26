import yaml
import sys

def _sanitize_type(raw: str) -> str:
    """Mermaid erDiagram 호환 타입으로 변환.
    - 배열 표기(string[]) → string-array
    - union/리터럴 타입('a' | 'b') → enum
    - 공백·특수문자 포함 시 하이픈으로 치환
    """
    raw = raw.strip()
    # union 리터럴 타입: 따옴표나 파이프 포함
    if "|" in raw or "'" in raw or '"' in raw:
        return "enum"
    # 배열 표기: Type[]
    if raw.endswith("[]"):
        base = raw[:-2]
        return f"{base}-array"
    # 공백 포함 시 하이픈으로 치환
    if " " in raw:
        return raw.replace(" ", "-")
    return raw


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
                prop_type = _sanitize_type(prop_type)
                lines.append(f"        {prop_type} {prop_name}")
            lines.append("    }")

    print("\n".join(lines))

if __name__ == "__main__":
    yaml_to_mermaid(sys.argv[1])