const express = require('express')
const { verifyToken } = require('../middlewares')
const {
	createPlan,
	getPlan,
	getPlanList,
	deletePlan,
	updatePlan,
	setPlanDetail,
	getPlanDetail,
} = require('../controllers/plan')
const router = express.Router()

// POST 	/plan  			플랜 최초 저장하기
router.post('/', verifyToken, createPlan)

// GET		/plan/me		플랜 리스트 조회하기
router.get('/me', verifyToken, getPlanList)

// GET		/plan/:plan_no	플랜 조회하기
router.get('/:plan_no', verifyToken, getPlan)

// PUT    	/plan/:plan_no  플랜 갱신하기
router.put('/:plan_no', verifyToken, updatePlan)

// DELETE	/plan/:plan_no	플랜 삭제하기
router.delete('/:plan_no', verifyToken, deletePlan)

// POST 	/plan/:plan_no/plan_detail  플랜 상세정보 저장 및 갱신하기
router.put('/:plan_no/plan_detail', verifyToken, setPlanDetail)

// GET 		/plan/:plan_no/plan_detail  플랜 상세정보 조회하기
router.get('/:plan_no/plan_detail', verifyToken, getPlanDetail)

module.exports = router
