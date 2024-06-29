import json

highlights = []
book_info = {"title": "", "author": ""}

FILENAME = "file1_test.txt"

def clean_text(text):
    return text.replace("\n", " ").replace("\xa0", " ").strip()

def save_book_info(lines):
    first_line = lines[0]
    book_info["title"] = clean_text(first_line[first_line.index("<<")+2:first_line.index(">>")-1+1])
    book_info["author"] = clean_text(first_line[first_line.index(">>")+2:])

def add_highlight(lines, start, end):
    quote = clean_text("".join(lines[start+1:end]))
    highlights.append(quote)
    
def show_highlights():
    print("HIGHLIGHTS: ")
    print("\n")
    for line in highlights:
        print(line)
        print("\n")

def process_file(filename):
    highlight_break = "-------------------"
    found_start = False
    highlight_start = None
    highlight_end = None
    with open(filename,"r", encoding="utf-8-sig") as file:
        lines = file.readlines()
        save_book_info(lines)
        for index, line in enumerate(lines):
            if(line[0] == "2"):
                if found_start is False:
                    highlight_start = index
                    found_start = True
            if(line.strip() == highlight_break):
                if found_start is True:
                    highlight_end =  index
                    #print(f"START: {highlight_start}, END: {highlight_end}")
                    add_highlight(lines, highlight_start, highlight_end)
                    found_start =  False

def save_file(filename):
    highlights_json = []
    for highlight in highlights:
        new_highlight ={}
        new_highlight["highlight"] = highlight
        new_highlight["book_title"] = book_info["title"]
        new_highlight["book_author"] = book_info["author"]
        highlights_json.append(new_highlight)
    output_filename = f"{filename.split('.')[0]}-output.json"
    with open(output_filename, "w",  encoding="utf-8") as file:
        json.dump(highlights_json, file, ensure_ascii=False, indent=4)
        #for highlight in highlights:
        #    file.write(highlight+"\n")

if __name__ == "__main__":
    process_file(FILENAME)
    show_highlights()
    print(book_info)
    save_file(FILENAME)