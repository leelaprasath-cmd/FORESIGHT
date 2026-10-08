from PIL import Image

def make_white_transparent(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # threshold for white
    for item in datas:
        # If RGB values are close to white (e.g., > 240)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

input_image = r"C:\Users\ADMIN\.gemini\antigravity\brain\7e8f79ee-1659-44d7-9050-ec7295e0db0a\foresight_logo_1791445398254.jpg"
output_image = r"c:\Old_D_Drive_Files\Hackathon\FORESIGHT\frontend\public\logo.png"

make_white_transparent(input_image, output_image)
