const express = require('express')
const { getRegionGuide, getRegionList } = require('../controllers/region')

const router = express.Router()

// GET  /region?keyword=  지역 검색 기능
router.get('/', getRegionList)

// GET  /region/:region_no   지역 상세 보기 기능
router.get('/:region_no', getRegionGuide)

module.exports = router
