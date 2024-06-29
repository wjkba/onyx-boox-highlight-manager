FILENAME = "file1_test.txt"
highlight_break = "-------------------"
highlight_start = None
highlight_end = None
found_start = False

highlights = []


def add_highlight(lines, start, end):
    quote_list = lines[start+2:end]
    quote = ""
    for line in quote_list:
        quote += line
    formatted_quote = quote.replace("\n", " ").strip()
    highlights.append(formatted_quote)
    

with open(FILENAME,"r", encoding="utf-8-sig") as file:
    lines = file.readlines()
    for index, line in enumerate(lines):
        if(line.strip() == highlight_break):
            if found_start is True:
                highlight_end = index
                print(f"START: {highlight_start}, END: {highlight_end}")
                add_highlight(lines=lines, start=highlight_start, end=highlight_end)
                found_start = False
            if found_start is False:
                highlight_start = index
                found_start = True
            print(f"BREAK AT {index}")


print(highlight_break)
print("HIGHLIGHTS: ")
print(highlight_break)
for line in highlights:
    print("\n")
    print(line)