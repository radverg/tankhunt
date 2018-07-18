var Data = {
	Items: {
		size: 0.9,
		types: {
			"LaserGun": 5
		}
	},

	DefaultTank: {
		asset: "tankBodys",
		anchorX: 0.5,
		anchorY: 0.5,
		sizeX: 1,
		sizeY: 1.4375
	}
 };

 interface Dat {
	 Items: {
		 size: number,
		 types: { [key: string]: number }
	 }
	 DefaultTank: {
		 asset: string,
		 anchorX: string,
		 anchorY:string,
		 sizeX: number,
		 sizeY: number
	 }
 }

 module.exports = Data;
