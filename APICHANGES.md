# API CHANGES

Diverse UI-components hebben lijsten nodig. Vooral voor autocompletes en
dergelijke is het van belang dat deze data (zeer) snel geladen wordt. Het
voorstel is daarom om interfaces te maken die direct uit Mongo de benodigde
data halen. Liefst met alle cache toeters en bellen die mogelijk zijn, want
deze GETs moeten zoveel mogelijk geoptimaliseerd worden voor een goede
gebruikerservaring. In de huidige situatie duurt het ophalen van resultaten
soms wel 30s!

## Languages

### Huidige situatie
- POST https://acc.repository.huygens.knaw.nl/v1/search/wwlanguages, met {term: *}
- GET https://acc.repository.huygens.knaw.nl/v1/search/QURY000000000644?rows=100
- RESPONSE facets, ids, results, rows, start, term, etc...
- results[0] = @properties: {}
					@relationCount: 0
					@relations: {}
					@type: "wwlanguage"
					@variationRefs: [{type: "language", id: "LANG000000004747"}, {type: "baselanguage", id: "LANG000000004747"},…]
					^code: "nno"
					^created: {timeStamp: 1429107283185, userId: "importer", vreId: "base"}
					^deleted: false
					^modified: {timeStamp: 1429107503869, userId: "importer", vreId: "neww"}
					^pid: null
					^rev: 2
					_id: "LANG000000004747"
					core: true
					name: "Norwegian Nynorsk"

### Voorstel
- GET https://acc.repository.huygens.knaw.nl/languages?vres=womenwriter,ebnm&query=*tes*&metadata=description,date,name
- RESPONSE [
		{
			key: "https://acc.repository.huygens.knaw.nl/languages/LANG000000004747",
			value: "Norwegian Nynorsk"
		}
	]