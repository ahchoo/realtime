Setup mongo
=================

### Install mongodb

### Add user

Start mongodb server using

```
mongod --auth
```

Then, open mongodb terminal using command

```
mongo
```

Swith to admin database

```
use admin
```

Create a user
```
db.createUser({user: 'admin', pwd: '1234', roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']})
```

You should be good!


### Init database

Run command

```
gulp initdb
```
