module.exports = function(){

	var mongo = require('mongodb');


	var Img = function(id, img, rank){
		this.id = id;
		this.img = img;
		this.rank = rank;
		return this;
	}


	var imgId = 0;
	var images = [];
	var isImgs = false;

	var nextImgId = function(){
		return imgId++;
	}

	return {
		addNewImg: function (data){
			for(var i =0; i < images.length; i++){
				if(images[i].img === data.src){
					images[i].rank += 1;
					var dbup = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
					dbup.open(function (err) {
						if(err) { console.log(err); }
						else {
							console.log('###########@@@@@@@@@@@@@@MongoDB connected to update!');
							dbup.collection('imgs', function (err, coll) {
								if(err) { console.log(err); }
								else {
									coll.update({"img": data.src}, {$set: {"rank": images[i].rank}}, function (err) {
										if(err) { console.log(err); }
										else{
											dbup.close();
										}
									});
								}
							});
						}
					});
					return images[i].id;
				}
			}
			var newImgId = nextImgId();
			var newImg = new Img(newImgId, data.src, 1);
			images.push(newImg);
			var dbi = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
			dbi.open(function (err) {
				if(err) { console.log(err); }
				else {
					console.log('###########@@@@@@@@@@@@@@MongoDB connected to insert!');
					dbi.collection('imgs', function (err, coll) {
						if(err) { console.log(err); }
						else {
							coll.insert(newImg, function(err) { if(err) { console.log(err); } });
							dbi.close();
							console.log('db closed');
						}
					});
				}
			});
			return newImgId;
		},
		getImgById: function (id){
			for(var i =0; i < images.length; i++){
				if(images[i].id === id){
					return images[i];
				}
			}
			return undefined;
		},
		getAllImgs: function() {
			images = images.sort(function(a,b){return b.rank-a.rank});
			return images;
		},
		getAllData: function (client, callback){
			if(!isImgs){
				var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
				db.open(function (err) {
					if(err) { console.log(err); }
					else {
						console.log('###########@@@@@@@@@@@@@@MongoDB connected!');
						db.collection('imgs', function (err, coll) {
							if(err) { console.log(err); }
							else {
								coll.find().toArray(function (err, items){
									if(err) { console.log(err); }
									else{
										images = items;
										imgId = items.length;
										isImgs = true;
										db.close();
										console.log('db closed');
										callback(client);
									}
								});
							}
						});
					}
				});
			}else{
				console.log('######@@@@@@@@@Data from memory');
				callback(client);
			}
		
	}

	};
};