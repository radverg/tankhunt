var Data = {
	Items: {
		size: 0.6,
		types: [
			"Laser"
		]
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
		 types: string[]
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
