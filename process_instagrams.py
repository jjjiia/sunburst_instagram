import csv
import json

##categories = ["city","urban","cityscape","metropolis","location","landmark","residential_area","urban_area","architecture","graffiti","social_group","party","human_activity","human_action","party","crowd","conversation","community","team","light","lighting","night","darkness","daylighting","light_fixture","people","person","man","woman","selfie","girl","pedestrian"]
categories = ["social group", "party", "human activity", "human action", "crowd", "conversation", "community", "city", "cityscape", "metropolis", "location", "landmark", "residential area", "metropolitan area", "architecture", "urban area", "light", "lighting", "light fixture", "darkness", "daylighting", "night", "people", "person", "man", "woman", "pedestrian", "girl", "selfie"]
def byCategory():
    with open('posts_all_lj.csv', 'rU') as csvfile:
        spamreader = csv.reader(csvfile)
        headers = spamreader.next()
        dictionary = {}
        dictionary["Day"] = {}
        dictionary["Night"] = {}
        for row in spamreader:
            
            keyword = row[5].replace(" ","_")
            url = row[1]
            
            if keyword in categories and url != "":
                time = row[2]
                lat = row[3]
                lng = row[4]

                if time == "Day":
                    if keyword in dictionary["Day"].keys():
                        dictionary["Day"][keyword].append([url,lat,lng])
                    else:
                        dictionary["Day"][keyword]=[]
                        dictionary["Day"][keyword].append([url,lat,lng])
                if time == "Night":
                    if keyword in dictionary["Night"].keys():
                        dictionary["Night"][keyword].append([url,lat,lng])
                    else:
                        dictionary["Night"][keyword]=[]
                        dictionary["Night"][keyword].append([url,lat,lng])
#                break


    with open('instagrams.json', 'w') as outfile:
        json.dump(dictionary, outfile)


byCategory()



