// 서버 접속 확인용 페이지 기능
exports.renderMain = (req, res) => {
	console.log('........');
	console.log(req.body);
	res.send('back-end')
}

