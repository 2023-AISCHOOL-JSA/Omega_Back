const express = require('express')
const { getRegionGuide, getRegionList, getRegionDormitory, getRegionPlace } = require('../controllers/region')

const router = express.Router()

// GET  /region?keyword=  지역 검색 기능
router.get('/', getRegionList)

// GET  /region/:region_no   지역 상세 보기 기능
router.get('/:region_no', getRegionGuide)

// GET  /region/:region_no/dormitory   지역 기숙사 추천 리스트 조회 기능
router.get('/:region_no/dormitory', getRegionDormitory)

// GET  /region/:region_no/place   지역 여행지 추천 리스트 조회 기능
router.get('/:region_no/place', getRegionPlace)

module.exports = router
