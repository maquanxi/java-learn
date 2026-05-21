const images = {
  hero: 'https://images.pexels.com/photos/5965527/pexels-photo-5965527.jpeg?auto=compress&cs=tinysrgb&w=1200',
  advisor: 'https://images.pexels.com/photos/12969403/pexels-photo-12969403.jpeg?auto=compress&cs=tinysrgb&w=1200',
  campus: 'https://images.pexels.com/photos/6146987/pexels-photo-6146987.jpeg?auto=compress&cs=tinysrgb&w=1200',
  career: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80'
}

const nationalSources = [
  { name: '教育部全国高等学校名单', type: 'university', url: 'https://hudong.moe.gov.cn/qggxmd/' },
  { name: '阳光高考信息平台', type: 'admission', url: 'https://gaokao.chsi.com.cn/' },
  { name: '全国大学生创业服务网', type: 'competition', url: 'https://cy.ncss.cn/' },
  { name: '“十四五”规划和2035年远景目标纲要', type: 'policy', url: 'https://www.gov.cn/xinwen/2021-03/13/content_5592681.htm' },
  { name: '数字中国建设整体布局规划', type: 'policy', url: 'https://www.gov.cn/zhengce/2023-02/27/content_5743484.htm' },
  { name: '“十四五”数字经济发展规划', type: 'policy', url: 'https://www.gov.cn/zhengce/content/2022-01/12/content_5667817.htm' },
  { name: '全国大学生就业服务平台', type: 'career', url: 'https://www.ncss.cn/' },
  { name: '人力资源和社会保障部', type: 'career', url: 'https://www.mohrss.gov.cn/' }
]

const provinceSources = [
  ['北京', '北京教育考试院', 'https://www.bjeea.cn/', ['北京省', '北京市', '京']],
  ['天津', '天津招考资讯网', 'https://www.zhaokao.net/', ['天津市', '津']],
  ['河北', '河北省教育考试院', 'https://www.hebeea.edu.cn/', ['河北省', '冀']],
  ['山西', '山西招生考试网', 'https://www.sxkszx.cn/', ['山西省', '晋']],
  ['内蒙古', '内蒙古招生考试信息网', 'https://www.nm.zsks.cn/', ['内蒙古自治区', '蒙']],
  ['辽宁', '辽宁招生考试之窗', 'https://www.lnzsks.com/', ['辽宁省', '辽']],
  ['吉林', '吉林省教育考试院', 'http://www.jleea.edu.cn/', ['吉林省', '吉']],
  ['黑龙江', '黑龙江省招生考试信息港', 'https://www.lzk.hl.cn/', ['黑龙江省', '黑']],
  ['上海', '上海招考热线', 'https://www.shmeea.edu.cn/', ['上海市', '沪']],
  ['江苏', '江苏省教育考试院', 'https://www.jseea.cn/', ['江苏省', '苏']],
  ['浙江', '浙江省教育考试院', 'https://www.zjzs.net/', ['浙江省', '浙']],
  ['安徽', '安徽省教育招生考试院', 'https://www.ahzsks.cn/', ['安徽省', '皖']],
  ['福建', '福建省教育考试院', 'https://www.eeafj.cn/', ['福建省', '闽']],
  ['江西', '江西省教育考试院', 'https://www.jxeea.cn/', ['江西省', '赣']],
  ['山东', '山东省教育招生考试院', 'https://www.sdzk.cn/', ['山东省', '鲁']],
  ['河南', '河南省教育考试院', 'https://www.haeea.cn/', ['河南省', '豫']],
  ['湖北', '湖北省教育考试院', 'https://www.hbea.edu.cn/', ['湖北省', '鄂']],
  ['湖南', '湖南省教育考试院', 'https://www.hneeb.cn/', ['湖南省', '湘', '湖南招生考试信息港']],
  ['广东', '广东省教育考试院', 'https://eea.gd.gov.cn/', ['广东省', '粤']],
  ['广西', '广西招生考试院', 'https://www.gxeea.cn/', ['广西壮族自治区', '桂']],
  ['海南', '海南省考试局', 'https://ea.hainan.gov.cn/', ['海南省', '琼']],
  ['重庆', '重庆市教育考试院', 'https://www.cqksy.cn/', ['重庆市', '渝']],
  ['四川', '四川省教育考试院', 'https://www.sceea.cn/', ['四川省', '川', '蜀']],
  ['贵州', '贵州省招生考试院', 'https://zsksy.guizhou.gov.cn/', ['贵州省', '黔', '贵']],
  ['云南', '云南省招生考试院', 'https://www.ynzs.cn/', ['云南省', '滇', '云']],
  ['西藏', '西藏教育考试院', 'http://zsks.edu.xizang.gov.cn/', ['西藏自治区', '藏']],
  ['陕西', '陕西省教育考试院', 'https://www.sneea.cn/', ['陕西省', '陕', '秦']],
  ['甘肃', '甘肃省教育考试院', 'https://www.ganseea.cn/', ['甘肃省', '甘', '陇']],
  ['青海', '青海省教育考试网', 'http://www.qhjyks.com/', ['青海省', '青']],
  ['宁夏', '宁夏教育考试院', 'https://www.nxjyks.cn/', ['宁夏回族自治区', '宁']],
  ['新疆', '新疆招生网', 'https://www.xjzk.gov.cn/', ['新疆维吾尔自治区', '新']]
].map((item) => ({ province: item[0], name: item[1], url: item[2], aliases: item[3] || [] }))

const admissionKeywords = ['一分一段', '一分一档', '一分档', '一分表', '1分段', '档分', '投档', '录取', '分数线', '位次', '排位', '排名', '累计人数', '招生计划', '志愿']
const competitionKeywords = ['大学生创新', '互联网+', '挑战杯', '竞赛', '项目申报', '国创', '十四五', '数字中国', '数字经济', '乡村振兴', '绿色低碳']
const careerKeywords = ['就业', '职业', '岗位', '招聘', '新职业', '人才需求', '高校毕业生', '就业指导', '技能']

module.exports = {
  images,
  nationalSources,
  provinceSources,
  admissionKeywords,
  competitionKeywords,
  careerKeywords
}
