# blockscore-node

This is the official library for Node.JS clients of the BlockScore API. [Click here to read the full documentation](https://manage.blockscore.com/docs).

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

## Verifications
    
### List all verifications

```javascript
blockscore.verifications.list({}, callback);
```

### List `5` verifications

```javascript
blockscore.verifications.list({
  count: 5
}, callback);
```
    
### View a verification by ID

```javascript
blockscore.verifications.retrieve(verification_id, callback);
```

### Create a new verification

```javascript
blockscore.verifications.create({
	date_of_birth: '1993-08-23',
	identification: {
	  ssn: "0000"
	},
	address: {
	  street1: "1 Infinite Loop",
	  city: "Cupertino",
	  state: "CA",
	  postal_code: "95014",
	  country_code: "US"
	},
	name: {
	  first: "Alain",
	  last: "Meier"
	}
}, callback);
```

## Question Sets

### Create a new question set

```javascript
blockscore.questions.create(verification_id, callback);
```

### Score a question set

```javascript
var data = {
	verification_id: response.verification_id,
	question_set_id: response.id,
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
blockscore.questions.score(data, callback);
```

## Watchlist Candidates
    
### List all watchlist candidates

```javascript
blockscore.watchlist_candidates.list({}, callback);
```

### List `3` watchlist candidates

```javascript
blockscore.watchlist_candidates.list({
  count: 3
}, callback);
```
    
### View a watchlist candidate by ID

```javascript
blockscore.watchlist_candidates.retrieve(watchlist_candidate_id, callback);
```

### Create a new watchlist candidate

```javascript
blockscore.watchlist_candidates.create({
	date_of_birth: '1993-08-23',
	identification: {
	  ssn: "0000"
	},
	address: {
	  street1: "1 Infinite Loop",
	  city: "Cupertino",
	  state: "CA",
	  postal_code: "95014",
	  country_code: "US"
	},
	name: {
	  first: "Alain",
	  last: "Meier"
	}
}, callback);
```

### Update a watchlist candidate

Only the information you send us will be updated - the rest will remain the same.

```javascript
blockscore.watchlist_candidates.update(watchlist_candidate.id, {
	address_state:'CA', 
}, callback);
```

### View a watchlist candidate's past hits

```javascript
blockscore.watchlist_candidates.hits(watchlist_candidate.id, callback);
```

### Delete a watchlist candidate from scan list

```javascript
blockscore.watchlist_candidates.del(watchlist_candidate.id, callback);
```

### View a watchlist candidate's revision history	
```javascript
blockscore.watchlist_candidates.history(watchlist_candidate.id, callback);
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

