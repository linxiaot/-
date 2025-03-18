async function chooseToUpload() {
	// async goOcr() {
	console.log('chooseToUpload');
	// 本地图片
	var resImg = await wx.chooseMedia({
		count: 1,
		mediaType: ['image'],
		sourceType: ['album', 'camera'],
		sizeType: ['compressed']
	})
	console.log('resImg', resImg);
	var tempFilePath = resImg.tempFiles[0].tempFilePath

	return tempFilePath
	// // 图片大小控制在 4M
	// if (resImg.tempFiles[0].size/1024/1024>4) {
	//   console.log(resImg.tempFiles[0].size/1024/1024);
	//   return false
	// }

}


async function tobaiduocr() {
	var tempFilePath = await chooseToUpload()
	console.log('tempFilePath', tempFilePath);

	wx.getFileSystemManager().readFile({
		filePath: tempFilePath,
		encoding: 'base64',
		success: function (data) {
			var base64 = 'data:image/jpg;base64,' + data.data;
			// console.log(base64);
			// let Img_Url = encodeURIComponent(data.data)
			//   // console.log(Img_Url);

			// that.ocrNumNew(Img_Url)
			return ocrNumNew(base64)

		},
		fail: function (err) {
			console.log(err);
			return false
		}
	})

	// this.toBase642(tempFilePath)
}

function ocrNumNew(Img_Url) {
	// console.log(Img_Url);
	wx.request({
		url: 'https://aip.baidubce.com/oauth/2.0/token', //获取access_token
		data: {
			// grant_type： 必须参数， 固定为client_credentials；
			// client_id： 必须参数， 应用的API Key；
			// client_secret ： 必须参数， 应用的Secret Key；
			// grant_type: 'client_credentials',
			// client_id: 'ObsEGYHyBTy6yhDBfWuDRsb7',
			// client_secret: 'cR16c4BGzqPmZU0jo39EqEOyOT05ad70',
			grant_type: 'client_credentials',
			client_id: 'H282ConqqZGVhDIautnG1klS', //小蜜蜂
			client_secret: '6cxVPNoUG2zkoHzTDMbroSFN5PHGUOzE',
		},
		header: {
			'content-type': 'application/json' // 默认值
			// 'content-type': 'application/x-www-form-urlencoded' // 默认值
		},
		method: 'get',
		success(res) {
			// console.log('请求成功',res );
			console.log('access_token 请求成功,res.data.access_token为：', res.data.access_token);
			wx.request({
				// url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers', //数字识别
				// url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic', //通用文字识别（高精度版）
				url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic', //通用文字识别（高精度版）
				data: {
					access_token: res.data.access_token,
					// url: that.data.url
					// url: 'https://time-1guzwjn0765f3328-1305564548.tcloudbaseapp.com/%E5%8F%96%E8%B4%A7%E7%A0%81%E7%9F%AD%E4%BF%A1.png?sign=a75f48e5d7ebfc7cdd3b78c546db5a91&t=1619022456' 
					//图片的路径
					image: Img_Url
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
				},
				method: 'post',
				success(res) {
					// console.log('数字识别 请求成功:',res );
					console.log('数字识别 请求成功:', res);
					return res
				},
				fail(error) {
					console.log('数字识别 请求失败', error)
				}
			})
		},
		fail(error) {
			console.log('获取access_token 请求失败', error)
			return error
		}
	})
}


async function ocrNumAsync(Img_Url) {
	// console.log(Img_Url);
	var res0 = await wx.request({
		url: 'https://aip.baidubce.com/oauth/2.0/token', //获取access_token
		data: {
			// grant_type： 必须参数， 固定为client_credentials；
			// client_id： 必须参数， 应用的API Key；
			// client_secret ： 必须参数， 应用的Secret Key；
			// grant_type: 'client_credentials',
			// client_id: 'ObsEGYHyBTy6yhDBfWuDRsb7',
			// client_secret: 'cR16c4BGzqPmZU0jo39EqEOyOT05ad70',
			grant_type: 'client_credentials',
			client_id: 'H282ConqqZGVhDIautnG1klS', //小蜜蜂
			client_secret: '6cxVPNoUG2zkoHzTDMbroSFN5PHGUOzE',
		},
		header: {
			'content-type': 'application/json' // 默认值
			// 'content-type': 'application/x-www-form-urlencoded' // 默认值
		},
		method: 'get',
	})

	console.log(res0.data.access_token);


	var res = await wx.request({
		// url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers', //数字识别
		// url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic', //通用文字识别（高精度版）
		url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic', //通用文字识别（高精度版）
		data: {
			access_token: res.data.access_token,
			// url: that.data.url
			// url: 'https://time-1guzwjn0765f3328-1305564548.tcloudbaseapp.com/%E5%8F%96%E8%B4%A7%E7%A0%81%E7%9F%AD%E4%BF%A1.png?sign=a75f48e5d7ebfc7cdd3b78c546db5a91&t=1619022456' 
			//图片的路径
			image: Img_Url
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded' // 默认值
		},
		method: 'post',
	})
	console.log('数字识别 请求成功:', res);
	return res
}

module.exports = {
	tobaiduocr: tobaiduocr,
	chooseToUpload: chooseToUpload,
	ocrNumNew: ocrNumNew,
	ocrNumAsync: ocrNumAsync
}