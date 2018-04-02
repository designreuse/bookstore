package com.jshx.lbs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.jshx.lbs.domain.SysUser;
import com.jshx.lbs.repository.AlarmInfoRepository;
import com.jshx.lbs.repository.TreeArrayDataRepository;
import com.jshx.lbs.security.SecurityUtils;
import com.jshx.lbs.service.CarDataService;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import io.swagger.annotations.*;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import net.sf.json.JSON;
import org.hibernate.annotations.Parameter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.naming.Name;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.text.SimpleDateFormat;
import java.util.*;
@Api(value = "TreeArrayDataResource", description = "车辆实时数据和车辆树数据")
@RestController
@RequestMapping("/api")
public class TreeArrayDataResource {

    private final Logger logger = LoggerFactory.getLogger(TreeArrayDataResource.class);

    private final TreeArrayDataRepository treeArrayDataRepository;
    @Resource
    private AlarmInfoRepository alarmInfoRepository;

    public  TreeArrayDataResource(TreeArrayDataRepository treeArrayDataRepository)
    {
        this.treeArrayDataRepository = treeArrayDataRepository;
    }


    @ApiOperation(value="车辆实时数据", notes="车辆实时数据接口", produces = "application/json")
    @ApiModelProperty(name="yyy",value="xxx",example="{\"keyId\":\"String\" }")
    @ApiImplicitParams({
        @ApiImplicitParam(
            paramType = "query", name = "keyId", value = "车辆keyId", required = true ,dataType = "string",
            examples = @Example(value = {
            @ExampleProperty(mediaType="application/json", value="{\"keyId\":\"String\" }")})
        )
    })
    @ApiResponses({
        @ApiResponse(code = 200, message = "请求成功"),
        @ApiResponse(code = 400, message = "请求参数错误"),
        @ApiResponse(code = 401, message = "未授权的访问"),
        @ApiResponse(code = 403, message = "拒绝访问"),
        @ApiResponse(code = 404, message = "资源不存在"),
        @ApiResponse(code = 500, message = "服务器内部错误")
    })
    @PostMapping("/getCarRealData")
    @Timed
    @ResponseBody
    public String getCarRealData(@RequestParam(value = "keyId", required = true) String keyId)
    {
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        String userId = mapDetail.get("userId").toString();
        keyId = keyId.trim();
        String[] key_List  = keyId.split(",");

        List<String> keyList = new ArrayList<String>(Arrays.asList(key_List));

        //group权限校验
        //根据userId和companyId查groupId
        List<String> userGroupIdList = treeArrayDataRepository.getGroupId(userId,companyId);

        //根据keyId查carId,keyId键值对
        List<Object[]> ListMap0 = treeArrayDataRepository.getCarIdList(keyList,companyId);
        Map<String, String> keyAndCarIdMap = new HashMap<>();
        if(ListMap0.size()!=0)
        {
            for (Object[] object : ListMap0) {
                if (object[1] != null) {
                    keyAndCarIdMap.put(object[0] + "", object[1] + "");
                }
            }
        }
        //sql查询出carid
        List<String> newCarIdList = treeArrayDataRepository.getCarIdListByGroup(userGroupIdList);

        String carGroupId = "";

        List<Map<String, Object>> carRealInfoList =  new ArrayList<Map<String,Object>>();//实时信息的List

        //定义新的keyIdList
        List<String> newKeyIdList = new ArrayList<String>();
        if(newCarIdList.size()!=0)
        {
            for(String carId:newCarIdList)
            {
                if(keyAndCarIdMap.get(carId) != null && keyAndCarIdMap.get(carId) != "")
                {
                    newKeyIdList.add(keyAndCarIdMap.get(carId)+"");
                }

            }
        }

        //查询groupIdList集合//////////////////////////////////////////////////////////////////////
//        List<Map<String, Object>> keyAndGroupList = new ArrayList<Map<String,Object>>();
//        List<Object[]> ListMap1 = treeArrayDataRepository.getKeyAndGroup(carIdList);
//        if(ListMap1.size()!=0) {
//            for (Object[] object : ListMap1) {
//                HashMap<String, Object> map = new HashMap<String, Object>();
//                map.put("keyId", object[0] + "");
//                map.put("carId", object[1] + "");
//                map.put("groupId", object[2] + "");
//
//                keyAndGroupList.add(map);
//            }
//        }

        //使用newKeyIdList查询实时信息
        SimpleDateFormat myFmt=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date now=new Date();
        List<Object[]> ListMap = treeArrayDataRepository.getRealTimeInformation(newKeyIdList);
        if(ListMap.size()!=0) {
            for (Object[] object : ListMap) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("KEYID", object[0] + "");
                map.put("LAST_TIME", object[1] + "");
                map.put("LAST_LATITUDE", object[2] + "");
                map.put("LAST_LONGITUDE", object[3] + "");
                map.put("LAST_SPEED", object[4] + "");
                map.put("TERM_STATUS", object[5] + "");
                map.put("LAST_ALTITUDE",object[6] + "");
                map.put("CAR_TYPE", object[7] + "");
                map.put("CAR_NO", object[8] + "");
                map.put("PLATECOLOR", object[9] + "");
                map.put("D_NAME", object[10] + "");
                map.put("D_MOBILE", object[11] + "");
                map.put("alarmTime", myFmt.format(now) + "");

                //

                carRealInfoList.add(map);
            }
        }

        //转换成所需json串
        String result = null;
        if(carRealInfoList != null && carRealInfoList.size() != 0) {
            JSONArray jsonArray = new JSONArray();
            JSONObject jsonObject = null;
            Object value = null;
            for(Map<String, Object> map : carRealInfoList) {
                jsonObject = new JSONObject();
                Set<String> set = map.keySet();
                for(String key : set) {
                    value = map.get(key);
                    if(value != null) {
                        try {
                            jsonObject.put(key, value.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
                if(jsonObject.length() != 0) {
                    jsonArray.put(jsonObject);
                }
            }
            result = jsonArray.toString();
        }
        return result;
    }


    @PostMapping("/getTreeArrayData")
    @Timed
    @ResponseBody
    public String getTreeArrayData(@RequestParam(value = "groupFlag", required = false) String groupFlag)
    {
        String userName = SecurityUtils.getCurrentUserLogin();
        String user_id = "";
        Map<String,Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
        String companyId = mapDetail.get("companyId").toString();
        List<String> userMap = treeArrayDataRepository.getUserId(userName,companyId);
        if(userMap.size() > 0)
        {
             user_id = userMap.get(0);
        }
        //groupList
        List<String> groupIdList = treeArrayDataRepository.getGroupId(user_id,companyId);
        List< Map<String, Object>> comGroupList= new ArrayList<Map<String,Object>>();//小组数据



        List<Object[]> ListMap = treeArrayDataRepository.getCompanyInfo(companyId);
        List<Map<String, Object>> companyInfoList =  new ArrayList<Map<String,Object>>();
        if(ListMap.size()!=0) {
            for (Object[] object : ListMap) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("COMPANY_ID", object[0] + "");//company_Id
                map.put("COMPANY_NAME", object[1] + "");//company_name
                map.put("COMPANY_FULLNAME", object[2] + "");//company_fullname
                map.put("COMPANY_SYS_NAME", object[3] + "");//company_sys_name
                map.put("AREA_CODE", object[4] + "");//area_code
                map.put("REMARK", object[5] + "");//remark
                map.put("CAR_DEFAULT_ICON", object[6] + "");//car_default_icon
                map.put("AREA_ID", object[7] + "");//area_id
                map.put("CMP_DATA_PRI", object[8] + "");//cmp_data_pri
                map.put("COMPANY_TYPE", object[9] + "");//company_type
                map.put("VIDEO_SERVER_IP", object[10] + "");//video_server_ip
                map.put("VIDEO_SERVER_PORT", object[11] + "");//video_server_port

                companyInfoList.add(map);
            }
        }
        String cmp_data_pri=null;//数据权限
        if(null !=companyInfoList&&companyInfoList.size()==1){
            Map<String, Object> map = companyInfoList.get(0);
            if(null!=map.get("cmp_data_pri".toUpperCase())){
                cmp_data_pri = (String) map.get("cmp_data_pri".toUpperCase()).toString();
            }
        }else{
            logger.info(companyId+"不存在.");
        }

        //查询小组数据
        List< Map<String, Object>> comGroupList1= new ArrayList<Map<String,Object>>();

        List<Object[]> ListComGroup1 = treeArrayDataRepository.getGroupByAut(companyId,groupIdList);
        if(ListComGroup1.size()!=0) {
            for (Object[] object : ListComGroup1) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("PID", object[1] + "");
                map.put("COMPANYID", object[2] + "");
                map.put("GROUPNAME", object[3] + "");
                map.put("SORT", object[4] + "");
                map.put("GROUPLEVEL", object[5] + "");

                comGroupList1.add(map);
            }
        }
        //公司所有的小组
        List< Map<String, Object>> companyAllGroup= new ArrayList<Map<String,Object>>();//小组数据

        List<Object[]> ListComGroup = treeArrayDataRepository.getAllGroupByCompany(companyId);
        if(ListComGroup.size()!=0) {
            for (Object[] object : ListComGroup) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("GROUPNAME", object[1] + "");
                map.put("COMPANYID", object[2] + "");
                map.put("CREATEDBY", object[3] + "");
                map.put("PID", object[4] + "");
                map.put("SORT", object[5] + "");
                map.put("GROUPLEVEL", object[6] + "");

                companyAllGroup.add(map);
            }
        }

        List< Map<String, Object>> comGroupListForQ= new ArrayList<Map<String,Object>>();//小组数据
        if(null!=cmp_data_pri&&"1".equals(cmp_data_pri)){//有数据权限

            comGroupListForQ = comGroupList1;
        }else{

            //获得分组
            List< Map<String, Object>> comGroupList2= new ArrayList<Map<String,Object>>();
            List<Object[]> ListComGroup2 = treeArrayDataRepository.getGroupList(companyId);
            if(ListComGroup2.size()!=0) {
                for (Object[] object : ListComGroup2) {
                    HashMap<String, Object> map = new HashMap<String, Object>();
                    map.put("GROUPID", object[0] + "");
                    map.put("COMPANYID", object[1] + "");
                    map.put("GROUPNAME", object[2] + "");
                    map.put("CREATEDBY", object[3] + "");
                    map.put("PID", object[4] + "");
                    map.put("SORT", object[5] + "");

                    comGroupList2.add(map);
                }
            }
            comGroupListForQ = comGroupList2;
        }
        //终于获取了...
        comGroupList = getGroupData(comGroupListForQ,companyAllGroup);

        List< Map<String, Object>> GroupCarList= new ArrayList<Map<String,Object>>();//车辆数据

        String zTreeData="";//右侧树数据

        if (null != cmp_data_pri && "1".equals(cmp_data_pri)) {// 有数据权限

        } else {
            List l=groupIdList;
            if(l!=null &&l.size()==1){
                if("abc".equals(l.get(0))){
                    l.remove(0);
                }
            }
        }

        List<Object[]> ListGroupCar  = treeArrayDataRepository.getCarByAut(companyId,groupIdList);
        if(ListGroupCar.size()!=0) {
            for (Object[] object : ListGroupCar) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("CAR_NO", object[0] + "");
                map.put("NO", object[1] + "");
                map.put("KEY_ID", object[2] + "");
                map.put("GROUPID", object[3] + "");
                map.put("TERM_STATUS", object[4] + "");
                map.put("ONLINE_STATUS", object[5] + "");
                map.put("CAMCNT", object[6] + "");
                map.put("V_HARDWARE", object[7] + "");
                map.put("CAR_ID", object[8] + "");
                map.put("CREATE_TIME", object[9] + "");
                map.put("LAST_RECVTIME", object[10] + "");

                GroupCarList.add(map);
            }
        }

        Map<String, Object> carTotalMap = (Map<String, Object>) getCarOnlineTreeGridData(companyId, groupIdList);

        zTreeData = getJSONData(companyInfoList, comGroupList, GroupCarList, carTotalMap, groupFlag);

        try {
            zTreeData.getBytes("utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return zTreeData;
    }

    public static List<Map<String, Object>> getGroupData(List<Map<String, Object>> groupList,List<Map<String, Object>> companyAllGroup){
        List<Map<String, Object>> aList= new ArrayList<Map<String,Object>>();
        List<Map<String, Object>> delList= new ArrayList<Map<String,Object>>();
        if(null!=companyAllGroup &&companyAllGroup.size()>0){//小组列表
            for(Map<String, Object> map:companyAllGroup){
                if(null!=groupList &&groupList.size()>0){
                    for(Map<String, Object> groupMap:groupList){
                        if(null!=groupMap.get("PID")&&!"".equals(groupMap.get("PID"))){
                            if(groupMap.get("PID").toString().equals(map.get("GROUPID").toString())){
                                if(!aList.contains(map)){
                                    aList.add(map);
                                }
                            }
                        }
                    }
                }
            }
        }

        if(null!=aList &&aList.size()>0){//小组列表
            for(Map<String, Object> map:aList){
                if(null!=groupList &&groupList.size()>0){
                    for(Map<String, Object> groupMap:groupList){
                        if(null!=groupMap.get("GROUPID")&&!"".equals(groupMap.get("GROUPID"))){
                            if(groupMap.get("GROUPID").toString().equals(map.get("GROUPID").toString())){
                                delList.add(groupMap);
                            }
                        }
                    }
                }
            }
        }
        if(null!=delList&&delList.size()>0){
            for(Map<String, Object> map:delList){
                groupList.remove(map);
            }
        }

        groupList.addAll(aList);

        return groupList;
    }

    public Map<String, Object> getCarOnlineTreeGridData(String companyID)
    {

        List< Map<String, Object>> companyInfoList= new ArrayList<Map<String,Object>>();
        List<Object[]> ListCompanyInfo  = treeArrayDataRepository.getCompanyInfo(companyID);
        if(ListCompanyInfo.size()!=0) {
            for (Object[] object : ListCompanyInfo) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("COMPANY_ID", object[0] + "");//company_Id
                map.put("COMPANY_NAME", object[1] + "");//company_name
                map.put("COMPANY_FULLNAME", object[2] + "");//company_fullname
                map.put("COMPANY_SYS_NAME", object[3] + "");//company_sys_name
                map.put("AREA_CODE", object[4] + "");//area_code
                map.put("REMARK", object[5] + "");//remark
                map.put("CAR_DEFAULT_ICON", object[6] + "");//car_default_icon
                map.put("AREA_ID", object[7] + "");//area_id
                map.put("CMP_DATA_PRI", object[8] + "");//cmp_data_pri
                map.put("COMPANY_TYPE", object[9] + "");//company_type
                map.put("VIDEO_SERVER_IP", object[10] + "");//video_server_ip
                map.put("VIDEO_SERVER_PORT", object[11] + "");//video_server_port

                companyInfoList.add(map);
            }
        }


        List< Map<String, Object>> carOnlineList= new ArrayList<Map<String,Object>>();
        List< Map<String, Object>> carGroupList= new ArrayList<Map<String,Object>>();

        List<Object[]> ListCarOnline = treeArrayDataRepository.findCarOnlineData(companyID);

        if(ListCarOnline.size()!=0) {
            for (Object[] object : ListCarOnline) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("GROUPNAME", object[1] + "");
                map.put("PID", object[2] + "");
                map.put("TOTAL", object[3] + "");
                map.put("OFFLINE", object[4] + "");
                map.put("ONLINE", object[5] + "");
                map.put("GPSONLINE", object[6] + "");
                map.put("VIDEOONLINE", object[7] + "");
                map.put("SORT", object[8] + "");
                map.put("COMID", object[9] + "");

                carOnlineList.add(map);
            }
        }

        List<Object[]> ListCarGroup = treeArrayDataRepository.findCarOnlineGroupData(companyID);
        if(ListCarGroup.size()!=0) {
            for (Object[] object : ListCarGroup) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("PID", object[1] + "");
                map.put("GROUPNAME", object[2] + "");
                map.put("LEVEL", object[3] + "");
                map.put("DATALEAF", object[4] + "");
                map.put("GROUPLEVEL", object[5] + "");
                map.put("SORT", object[6] + "");

                carGroupList.add(map);
            }
        }

        Map<String, Object> sumMap=new HashMap<String, Object>();
        if(null!=companyInfoList&&companyInfoList.size()>0){
            Map<String, Object> map=companyInfoList.get(0);
            sumMap.put("GROUPNAME", map.get("COMPANY_FULLNAME"));
            sumMap.put("COMPANY_ID", map.get("COMPANY_ID"));
        }

        for( Map<String, Object> map:carGroupList){
            for(Map<String, Object> carMap:carOnlineList){
                if(carMap.get("GROUPID").toString().equals(map.get("GROUPID").toString())){
                    map.put("TOTAL", carMap.get("TOTAL"));
                    sumCarNum(carGroupList,carMap);
                }
            }
        }

        List< Map<String, Object>> delGroupList= new ArrayList<Map<String,Object>>();
        for( Map<String, Object> map:carGroupList){
            if(null!=map.get("TOTAL")){
            }else{
                delGroupList.add(map);
            }
        }

        if(delGroupList.size()>0){
            carGroupList.removeAll(delGroupList);
        }

        for(Map<String, Object> map:carGroupList){
            if(map.get("PID")==null){
                int parentTotal=0;
                int childTotal=Integer.valueOf(map.get("TOTAL").toString());
                if(null!=sumMap.get("TOTAL")){
                    parentTotal=Integer.valueOf(sumMap.get("TOTAL").toString());
                }
                sumMap.put("TOTAL",parentTotal+childTotal);
            }
        }

        Map<String, Object> totalMap=new HashMap<String, Object>();
        carGroupList.add(0, sumMap);
        for(Map<String, Object> map:carGroupList){
            totalMap.put(map.get("GROUPID")+"", map.get("TOTAL"));
        }

        return totalMap;
    }

    public void sumCarNum(List< Map<String, Object>> carOnlineList,Map<String, Object> carMap){

        for(Map<String, Object> map:carOnlineList){
            if(null!=carMap.get("PID")){
                if(carMap.get("PID").toString().equals(map.get("GROUPID").toString())){
                    Map<String, Object> mapCount= new HashMap<String, Object>();
                    if(null!=map.get("PID")){
                        if(null!=map.get("TOTAL")){
                            Integer a=Integer.valueOf(map.get("TOTAL").toString());
                            Integer b=Integer.valueOf(carMap.get("TOTAL").toString());
                            map.put("TOTAL", a+b);
                        }else{
                            map.put("TOTAL", carMap.get("TOTAL"));
                        }
                        mapCount.put("PID", map.get("PID").toString());
                        mapCount.put("TOTAL", carMap.get("TOTAL"));
                    }else{
                        int parentTotal=0;
                        int childTotal=Integer.valueOf(carMap.get("TOTAL").toString());
                        if(null!=map.get("TOTAL")){
                            parentTotal=Integer.valueOf(map.get("TOTAL").toString());
                        }
                        map.put("TOTAL",parentTotal+childTotal);
                    }
                    sumCarNum(carOnlineList,mapCount);
                }
            }

        }
    }

    public String getJSONData(List<Map<String, Object>> companyList,
                              List<Map<String, Object>> groupList,
                              List<Map<String, Object>> carList,
                              Map<String, Object> carTotalMap,
                              String groupFlag) {
        StringBuffer json=new StringBuffer("[");
        String data="";
        if(null!=companyList &&companyList.size()>0){//公司列表
            for(Map<String, Object> map:companyList){
                json.append("{\"id\":\"").append(map.get("company_id".toUpperCase()).toString()).append("\",");//id不能重复
                json.append("\"pId\":\"").append("0").append("\",");//父ID可以重复
                json.append("\"iconSkin\":\"").append("m").append("\",");//树形菜单上的图标(对应配置在zTreeStyle.css中)
                if(null!=map.get("VIDEO_SERVER_IP")){//端口ip
                    //serverIp=map.get("VIDEO_SERVER_IP").toString();
                    json.append("\"p\":\"").append(map.get("VIDEO_SERVER_IP").toString()).append("\",");//终端ip
                }
                if(null!=map.get("VIDEO_SERVER_PORT")){//端口号
                    //  serverPort=map.get("VIDEO_SERVER_PORT").toString();
                    json.append("\"r\":\"").append(map.get("VIDEO_SERVER_PORT").toString()).append("\",");//终端端口
                }
                if(null!=groupFlag&&"group".equals(groupFlag)){
                    json.append("\"name\":\"").append(map.get("company_fullname".toUpperCase()).toString()).append("\"},");
                }else{
                    json.append("\"name\":\"").append(map.get("company_fullname".toUpperCase()).toString()+"("+carList.size()+")").append("\"},");
                }
            }
        }

        try {
            listSort(groupList);
        } catch (Exception e1) {
            e1.printStackTrace();
        }


//	      Map<String, Object> carTotalMap = (Map<String, Object>) getCarOnlineTreeGridData(companyId, groupList);
        if(null!=groupList &&groupList.size()>0){//小组列表
            for(Map<String, Object> map:groupList){
                json.append("{\"id\":\"").append(map.get("groupid".toUpperCase()).toString()).append("\",");
                if(map.get("PID")!=null&&!"null".equals(map.get("PID").toString())&&!"".equals(map.get("PID").toString())){
                    json.append("\"pId\":\"").append(map.get("PID").toString()).append("\",");
                }else{
                    json.append("\"pId\":\"").append(map.get("companyid".toUpperCase()).toString()).append("\",");
                }
                json.append("\"iconSkin\":\"").append("t").append("\",");
                if(null!=map.get("SORT")&&!"".equals(map.get("SORT"))){
                    json.append("\"s\":\"").append(map.get("SORT").toString()).append("\",");
                }
                if(null!=map.get("GROUPLEVEL")&&!"".equals(map.get("GROUPLEVEL"))){
                    json.append("\"l\":\"").append(map.get("GROUPLEVEL").toString()).append("\",");//车队组级别
                }
                if(null!=groupFlag&&"group".equals(groupFlag)){
                    json.append("\"name\":\"").append(map.get("groupname".toUpperCase()).toString()).append("\"},");
                }else{
                    if(null!=carTotalMap.get(map.get("GROUPID")+"")&&!"".equals(carTotalMap.get(map.get("GROUPID")+""))){
                        json.append("\"name\":\"").append(map.get("groupname".toUpperCase()).toString()+"("+carTotalMap.get(map.get("GROUPID").toString())+")").append("\"},");
                    }else{
                        json.append("\"name\":\"").append(map.get("groupname".toUpperCase()).toString()+"").append("\"},");
                    }
                }

            }
        }

        if (null != groupFlag && "group".equals(groupFlag)) {// 车队管理只显示到车队

        } else {
            if (null != carList && carList.size() > 0) {// 车辆列表
                for (Map<String, Object> map : carList) {
                    json.append("{\"id\":\"").append(map.get("KEY_ID".toUpperCase()).toString()).append("\",");
                    json.append("\"carId\":\"").append(map.get("car_Id".toUpperCase()).toString()).append("\",");
                    json.append("\"pId\":\"").append(map.get("groupid".toUpperCase()).toString()).append("\",");
//                    if(map.get("ONLINE_STATUS")!=null&&!map.get("ONLINE_STATUS").toString().equals("0")&&null!=map.get("TERM_STATUS")&&!map.get("TERM_STATUS").toString().equals("0")){
//                        json.append("\"iconSkin\":\"").append("c").append("\",");//视频在线，gps在线
//                    }else if(map.get("ONLINE_STATUS")!=null&&!map.get("ONLINE_STATUS").toString().equals("0")){
//                        json.append("\"iconSkin\":\"").append("v").append("\",");//视频在线，gps离线
//
//                    }
                    if(null!=map.get("TERM_STATUS")&&!map.get("TERM_STATUS").toString().equals("0")){
                        json.append("\"iconSkin\":\"").append("on").append("\",");//视频离线，gps在线
                    }else{
                        json.append("\"iconSkin\":\"").append("off").append("\",");//视频离线，gps离线
                    }

//                    String flag=getRequest().getParameter("flag");
                    String flag = "0";

                    if(map.get("CAMCNT")!=null){
                        json.append("\"v\":\"").append(map.get("CAMCNT".toUpperCase()).toString()).append("\",");
                    } else {
                        json.append("\"v\":\"").append("4").append("\",");//终端数
                    }

                    if("1".equals(flag))
                    {
//                        json.append("\"name\":\"").append(map.get("NO")!=null&&!"".equals(map.get("NO"))?map.get("NO").toString():map.get("car_no".toUpperCase()).toString()).append("\"},");
                    }
                    else
                    {
                    json.append("\"name\":\"").append(map.get("car_no".toUpperCase()).toString()).append("\"},");
                    }


                }
            }
        }

        data=json.substring(0, json.length()-1)+"]";
        return data;
    }

    public void listSort(List<Map<String, Object>> resultList) throws Exception {
        // resultList是需要排序的list，其内放的是Map
        // 返回的结果集
        Collections.sort(resultList, new Comparator<Map<String, Object>>() {
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                // o1，o2是list中的Map，可以在其内取得值，按其排序，此例为升序，s1和s2是排序字段值
                Integer s1 = 0;
                Integer s2 = 0;

                if (!StringUtils.isNumeric((String) o1.get("SORT"))) {
                    s1 = 1;
                } else if (null != o1.get("SORT") && !"".equals(o1.get("SORT"))) {
                    s1 = Integer.valueOf(o1.get("SORT").toString());
                }

                if (!StringUtils.isNumeric((String) o2.get("SORT"))) {
                    s2 = 1;
                }else if (null != o2.get("SORT") && !"".equals(o2.get("SORT"))) {
                    s2 = Integer.valueOf(o2.get("SORT").toString());
                }

                if (s1 == s2) {
                    return 0;
                } else if (s1 > s2) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
    }

    /**
     * 车队车辆总数
     *@author
     *
     */
    public  Map<String, Object> getCarOnlineTreeGridData(String companyId,List LOGIN_USER_GROUP_ID){
        Map<String, Object> paraMap = new HashMap<String, Object>();
        paraMap.put("groupId", LOGIN_USER_GROUP_ID);
        paraMap.put("companyId", companyId);

//        List< Map<String, Object>> companyInfoList = dataAuthorityService.getCompanyInfo(paraMap);//公司数据
        List<Object[]> ListMap = treeArrayDataRepository.getCompanyInfo(companyId);
        List<Map<String, Object>> companyInfoList =  new ArrayList<Map<String,Object>>();
        if(ListMap.size()!=0) {
            for (Object[] object : ListMap) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("COMPANY_ID", object[0] + "");//company_Id
                map.put("COMPANY_NAME", object[1] + "");//company_name
                map.put("COMPANY_FULLNAME", object[2] + "");//company_fullname
                map.put("COMPANY_SYS_NAME", object[3] + "");//company_sys_name
                map.put("AREA_CODE", object[4] + "");//area_code
                map.put("REMARK", object[5] + "");//remark
                map.put("CAR_DEFAULT_ICON", object[6] + "");//car_default_icon
                map.put("AREA_ID", object[7] + "");//area_id
                map.put("CMP_DATA_PRI", object[8] + "");//cmp_data_pri
                map.put("COMPANY_TYPE", object[9] + "");//company_type
                map.put("VIDEO_SERVER_IP", object[10] + "");//video_server_ip
                map.put("VIDEO_SERVER_PORT", object[11] + "");//video_server_port

                companyInfoList.add(map);
            }
        }

        List< Map<String, Object>> carOnlineList= new ArrayList<Map<String,Object>>();
        List< Map<String, Object>> carGroupList= new ArrayList<Map<String,Object>>();
        String cmp_data_pri=null;//数据权限
        if(null !=companyInfoList&&companyInfoList.size()==1){
            Map<String, Object> map = companyInfoList.get(0);
            if(null!=map.get("cmp_data_pri".toUpperCase())){
                cmp_data_pri = (String) map.get("cmp_data_pri".toUpperCase()).toString();
            }
        }
        if(null!=cmp_data_pri&&"1".equals(cmp_data_pri)){

        }else{
            List l=(List) paraMap.get("groupId");
            if(l.size()==1){
                if("abc".equals(l.get(0))){
                    l.remove(0);
                }
            }
        }

//        carOnlineList=treeDataService.findCarOnlineData(paraMap);
//        carGroupList=treeDataService.findCarOnlineGroupData(paraMap);

        carOnlineList= new ArrayList<Map<String,Object>>();
        carGroupList= new ArrayList<Map<String,Object>>();

        List<Object[]> ListCarOnline = treeArrayDataRepository.findCarOnlineData(companyId);
        if(ListCarOnline.size()!=0) {
            for (Object[] object : ListCarOnline) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("GROUPNAME", object[1] + "");
                map.put("PID", object[2] + "");
                map.put("TOTAL", object[3] + "");
                map.put("OFFLINE", object[4] + "");
                map.put("ONLINE", object[5] + "");
                map.put("GPSONLINE", object[6] + "");
                map.put("VIDEOONLINE", object[7] + "");
                map.put("SORT", object[8] + "");
                map.put("COMID", object[9] + "");

                carOnlineList.add(map);
            }
        }

        List<Object[]> ListCarGroup = treeArrayDataRepository.findCarOnlineGroupData(companyId);
        if(ListCarGroup.size()!=0) {
            for (Object[] object : ListCarGroup) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("GROUPID", object[0] + "");
                map.put("PID", object[1] + "");
                map.put("GROUPNAME", object[2] + "");
                map.put("LEVEL", object[3] + "");
                map.put("DATALEAF", object[4] + "");
                map.put("GROUPLEVEL", object[5] + "");
                map.put("SORT", object[6] + "");

                carGroupList.add(map);
            }
        }
        Map<String, Object> sumMap=new HashMap<String, Object>();
        if(null!=companyInfoList&&companyInfoList.size()>0){
            Map<String, Object> map=companyInfoList.get(0);
            sumMap.put("GROUPNAME", map.get("COMPANY_FULLNAME"));
            sumMap.put("COMPANY_ID", map.get("COMPANY_ID"));
        }
        for( Map<String, Object> map:carGroupList){
            for(Map<String, Object> carMap:carOnlineList){
                if(carMap.get("GROUPID").toString().equals(map.get("GROUPID").toString())){
                    map.put("TOTAL", carMap.get("TOTAL"));
                    sumCarNum(carGroupList,carMap);
                }
            }
        }

        List< Map<String, Object>> delGroupList= new ArrayList<Map<String,Object>>();
        for( Map<String, Object> map:carGroupList){
            if(null!=map.get("TOTAL")){
            }else{
                delGroupList.add(map);
            }
        }

        if(delGroupList.size()>0){
            carGroupList.removeAll(delGroupList);
        }

        for(Map<String, Object> map:carGroupList){
            if(map.get("PID")==null){
                int parentTotal=0;
                int childTotal=Integer.valueOf(map.get("TOTAL").toString());
                if(null!=sumMap.get("TOTAL")){
                    parentTotal=Integer.valueOf(sumMap.get("TOTAL").toString());
                }
                sumMap.put("TOTAL",parentTotal+childTotal);
            }
        }
        Map<String, Object> totalMap=new HashMap<String, Object>();
        carGroupList.add(0, sumMap);
        for(Map<String, Object> map:carGroupList){
            totalMap.put(map.get("GROUPID")+"", map.get("TOTAL"));
        }

        return totalMap;
    }
}
