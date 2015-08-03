# API CHANGES

## One-to-many relaties
Er wordt geen onderscheidt gemaakt tussen one-to-many en many-to-many
relaties. Een document heeft bijvoorbeeld een "hasPublishLocation",
volgens de UI een one-to-many relatie, maar van de server wordt een
array ontvangen.

### Nu

## GET @relations
De relaties zijn er ingewikkeld en niet het volledige path van
het object wordt teruggegeven. Accepted: false zou gefiltered moeten
worden, want dient als een verkapte delete.

### Nu
{
	accepted: true
	displayName: "German"
	id: "LANG000000001550"
	path: "domain/wwlanguages/LANG000000001550"
	relationId: null
	rev: 0
	type: "wwlanguage"
}

### Voorstel
{
	key: "https://acc.hing.nl/domain/wwlanguages/LANG000000001550"
	value: "German"
}

## @relations object

## Author.types
Geeft een array terug, maar de UI biedt maar één waarde aan.

### Nu
types: ["AUTHOR"]

### Voorstel
type: "Author"

## Author.children & Author.gender
Geeft hoofdletters

### Nu
children: "UNKOWN"

### Voorstel
children: "Unknown"

## Author.names & Author.pseudonyms

### Nu
Een array van objecten, met daarin een components prop:
names: [{
	components: [{
		type: FORENAME,
		value: "Sophie"
	}, {
		type: SURNAME,
		value: "Alberti"
	}]
}, ...]

### Voorstel
names: [{
	firstName: "Sophie",
	lastName: "Alberti"
}, ...]

## Saven

### Nu
1. Na het saven (PUT) moet er gewacht worden op de ^pid voor er opnieuw gesaved mag worden. Naast dat dit erg gebruikersonvriendelijk is, moeten er aan de frontend trucs worden uitgehaald (polling?) om te achterhalen wanneer er weer gesaved kan worden.
2. Na het saven (PUT/POST), moet het object opnieuw opgehaald worden. Dat is nodig, want de frontend heeft de nieuwe ^rev en ^pid nodig voor er weer gesaved kan worden.

### Voorstel
Na een POST/PUT het nieuwe object (incl ^pid) meesturen als response.

### Resource location als ID

### Nu
Soms wordt een resource location teruggestuurd door de server (bijv in
de faceted search), soms alleen het ID. De frontend moet nu coderen waar
welk type ID wordt teruggegeven.

### Voorstel
Overal resource locations (entiteiten, relaties, etc).