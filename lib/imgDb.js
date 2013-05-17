module.exports = function(){

	var Img = function(id, img, rank){
		this.id = id;
		this.img = img;
		this.rank = rank;
		return this;
	}

	var imgId = 0;

	var nextImgId = function(){
		return imgId++;
	}

	var images = [];

	return {
		addNewImg: function (data){
			for(var i =0; i < images.length; i++){
				if(images[i].img === data.src){
					images[i].rank += 1;
					return images[i].id;
				}
			}
			var newImgId = nextImgId();
			images.push(new Img(newImgId, data.src, 1));
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
		getAllImgs: function(){
			images = images.sort(function(a,b){return b.rank-a.rank});
			return images;
		}
	}

};