# blockscore-node

This is the official library for Node.JS clients of the BlockScore API. [Click here to read the full documentation](http://docs.blockscore.com/v4.0/node/).

## Install

Via npm:

```javascript
npm install blockscore
```

## Getting Started

### Initializing BlockScore

```javascript
var blockscore = require('blockscore')('your api key')
```

## People
    
### List all people

```javascript
blockscore.people.list({}, callback);
```

### List `5` people

```javascript
blockscore.people.list({
  count: 5
}, callback);
```
    
### View a person by ID

```javascript
blockscore.people.retrieve(person_id, callback);
```

### Create a new person

```javascript
blockscore.people.create({
  name_first: "John",
  name_last: "Doe",
  birth_year: '1993',
  birth_month: '01',
  birth_day: '13',
  document_type: "ssn",
  document_value: "0000",
  address_street1: "3515 Woodridge Lane",
  address_city: "Memphis",
  address_subdivision: "TN",
  address_postal_code: "38115",
  address_country_code: "US"
}, callback);
```

## Question Sets

### Create a new question set

```javascript
blockscore.question_sets.create(person_id, callback);
```

### Score a question set

```javascript
var data = {
	id: response.id,
	answers: [
	  {
	    question_id: 1,
	    answer_id: 1
	  },
	  {
	    question_id: 2,
	    answer_id: 1
	  },
	  {
	    question_id: 3,
	    answer_id: 1
	  },
	  {
	    question_id: 4,
	    answer_id: 1
	  },
	  {
	    question_id: 5,
	    answer_id: 1
	  }
	]
};
blockscore.question_sets.score(data, callback);
```

## Companies
    
### List all companies

```javascript
blockscore.companies.list({}, callback);
```

### List `5` companies

```javascript
blockscore.companies.list({
  count: 5
}, callback);
```
    
### View a company by ID

```javascript
blockscore.companies.retrieve(company_id, callback);
```

### Create a new company

```javascript
blockscore.companies.create({
  "entity_name": "BlockScore",
  "tax_id": "123410000",
  "incorporation_year": "1980",
  "incorporation_month": "8",
  "incorporation_day": "25",
  "incorporation_state": "DE",
  "incorporation_country_code": "US",
  "incorporation_type": "corporation",
  "dbas": "BitRemit",
  "registration_number": "123123123",
  "email": "test@example.com",
  "url": "https://blockscore.com",
  "phone_number": "6505555555",
  "ip_address": "67.160.8.182",
  "address_street1": "123 Fake Streets",
  "address_street2": null,
  "address_city": "Stanford",
  "address_subdivision": "CA",
  "address_postal_code": "94305",
  "address_country_code": "US"
}, callback);
```

## Candidates
    
### List all candidates

```javascript
blockscore.candidates.list({}, callback);
```

### List `3` candidates

```javascript
blockscore.candidates.list({
  count: 3
}, callback);
```
    
### View a candidate by ID

```javascript
blockscore.candidates.retrieve(candidate_id, callback);
```

### Create a new candidate

```javascript
blockscore.candidates.create({
  date_of_birth: '1993-01-13',
  ssn: "0000",
  address_street1: "3515 Woodridge Lane",
  address_city: "Memphis",
  address_state: "TN",
  address_postal_code: "38115",
  address_country_code: "US",
  name_first: "Joe",
  name_last: "Schmo"
}, callback);
```

### Update a candidate

Only the information you send us will be updated - the rest will remain the same.

```javascript
blockscore.candidates.update(candidate.id, {
	address_state:'CA', 
}, callback);
```

### View a candidate's past hits

```javascript
blockscore.candidates.hits(candidate.id, callback);
```

### Delete a candidate from scan list

```javascript
blockscore.candidates.del(candidate.id, callback);
```

### View a candidate's revision history	
```javascript
blockscore.candidates.history(candidate.id, callback);
```

## Watchlists

### Search watchlists

Creates a new person, runs it through our verification process, and returns a list of all associated matches.

```javascript
blockscore.watchlists.search({
	candidate_id: id,  // required
	match_type: type  // optional
}, callback);
```



## Contributing to BlockScore
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
* Fork the project.
* Start a feature/bugfix branch.
* Commit and push until you are happy with your contribution.
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.

## Copyright

Copyright (c) 2014 BlockScore. See LICENSE.txt for
further details.

