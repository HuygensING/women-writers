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

## Author.birthPlace & Author.deathPlace

### Nu
Author.tempBirthPlace
Author.tempDeathPlace

### Voorstel
Author.birthPlace
Author.deathPlace

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

## Author.pseudonyms
Voorbeeld: https://acc.repository.huygens.knaw.nl/domain/wwpersons/PERS000000007037

### Nu
Er is een relatie hasPseudonym, maar die geeft een displayName terug,
dus geen splitsing tussen firstName en lastName. Er is ook een fsPseudonyms prop, maar die blijft leeg ([]).

### Voorstel
Relatie pseudonym verwijderen en de prop fsPseudonyms hernoemen naar
pseudonyms. Vergelijk vorige issue "Author.names & Author.pseudonyms".