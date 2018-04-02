package com.jshx.lbs.service.impl;
import com.jshx.lbs.domain.BaseReturnMessage;
import com.jshx.lbs.service.MsgSendService;
import com.jshx.lbs.service.mapper.MsgSendMapper;
import com.jshx.lbs.web.rest.util.GetUSerInfoUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("MsgSendService")
public class MsgSendServiceImpl implements MsgSendService{


    @Resource
    private MsgSendMapper msgSendMapper;
    @Override
    public List<Map> getDicSubmit(List<String> termtypeList) {
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("termtypeList",termtypeList);
        return msgSendMapper.getDicSubmit(paramMap);
    }

    @Override
    public String saveDicSubmit(int cmdId, List paras, List carids,List keyids,String ip) {
        String Idx = "";
        // 根据不同类型进行转换
        Map<String,Object> dictMap = new HashMap<String,Object>();
        if (cmdId != 901 && cmdId != 902 && cmdId != 903 && cmdId != 904 && cmdId != 905 && cmdId != 906 && cmdId != 907 && cmdId != 908)
        {
            if (cmdId == 814 || cmdId == 816 || cmdId == 818 || cmdId == 820)
            {
                dictMap.put("Description","设置区域或线路指令");
            }
            else
            {
                dictMap =  msgSendMapper.getSingleDic(cmdId).get(0);
            }
        }
        if (cmdId == 8013)
        {
            cmdId = 905;
        }

        //读取终端信息
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("keyids",keyids);
        List<Map> termList = msgSendMapper.getCarTerm(paramMap);
        if(termList != null && termList.size()!=0)
        {
            for (int t = 0; t < termList.size(); t++) {
                Map<String, Object> carTerm = termList.get(t);
                String ChannelId = carTerm.get("ChannelId").toString();
                String termcompany = carTerm.get("termcompany").toString();
                int  CommandId = cmdId;
                String Carid="";
                //遍历读取车辆信息
                Map<String,Object> carparamMap = new HashMap<String,Object>();
                carparamMap.put("key_id",carids);
                carparamMap.put("company_id",carids);
                List<Map> carList = msgSendMapper.getSendCar(carparamMap);
                if(carList != null && carList.size()!=0) {
                    Map<String, Object> car = carList.get(0);
                if (car != null)
                    Carid = car.get("CAR_ID").toString();

                    String CommandPara = "";
                    String MsgcommandType = "";
                    String cmdpara="";
                    switch(cmdId)
                    {
                        case 901://手动拍照
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId =  119;
                                    CommandPara = paras.get(0).toString() + "," + paras.get(3).toString();
                                    break;
                                case "cx":
                                    CommandId = 203;
                                    CommandPara = paras.get(1).toString() + "," + paras.get(2).toString() + "," + paras.get(0).toString();
                                    break;
                                case "sl":
                                    CommandId = 302;
                                    CommandPara = paras.get(0).toString() + "," + paras.get(4).toString();
                                    break;
                                case "jtb":
                                    CommandId = 824;
                                    CommandPara = String.valueOf(paras.get(0).toString().indexOf("1") + 1)+ "," + paras.get(2).toString() + "," + paras.get(1).toString() + ",0,6,1,130,60,60,130";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 902://设置超速报警参数
                            switch (termcompany)
                            {
                                case "yx":
                                    CommandId  = 53;
                                    CommandPara = paras.get(0).toString() + "," + paras.get(3).toString();
                                    break;
                                case "cj":
                                case "cx":
                                case "ty":
                                    CommandId = 108;
                                    CommandPara  = paras.get(0).toString();
                                    break;
                                case "sl":
                                    CommandId = 309;
                                    CommandPara = paras.get(3).toString() + "," + paras.get(1).toString() + "," + paras.get(0).toString() + "," + paras.get(2).toString();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 903://锁车（断油断电）
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId = 105;
                                    break;
                                case "cx":
                                    CommandId = 209;
                                    break;
                                case "ty":
                                    CommandId = 451;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 904://解锁（供油供电）
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId  = 104;
                                    break;
                                case "cx":
                                    CommandId = 210;
                                    break;
                                case "ty":
                                    CommandId = 452;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 905://设置停车报警参数
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId = 109;
                                    CommandPara = paras.get(0).toString();
                                    break;
                                case "sl":
                                    CommandId  = 320;
                                    int parktime_sec = Integer.parseInt(paras.get(0).toString())* 60;
                                    CommandPara= String.valueOf(parktime_sec);
                                    break;
                                case "jtb"://部标终端停车超时设置
                                    CommandId = 801;
                                    CommandPara  = "1,90,"+paras.get(0).toString();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 906://电话监听
                            switch (termcompany)
                            {
                                case "cj":
                                case "cx":
                                case "hx":
                                    CommandId  = 107;
                                    CommandPara = paras.get(0).toString();
                                    break;
                                case "sl":
                                    CommandId = 318;
                                    CommandPara= paras.get(0).toString() + "," + paras.get(1).toString();
                                    break;
                                case "ty":
                                    CommandId  = 428;
                                    CommandPara  = paras.get(0).toString();
                                    break;
                                case "jtb":
                                    CommandId  = 811;
                                    CommandPara =  "0," + paras.get(0).toString();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 907://设置IP、端口、身份码
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId = 120;
                                    CommandPara = paras.get(0).toString() + "," + paras.get(1).toString();
                                    break;
                                case "cx":
                                    CommandId = 206;
                                    CommandPara  = paras.get(0).toString() + "," + paras.get(1).toString() + "," + paras.get(2).toString();
                                    break;
                                case "ty":
                                    CommandId  = 453;
                                    CommandPara  = paras.get(0).toString() + "," + paras.get(1).toString();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 908://查询参数
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId  = 101;
                                    break;
                                case "ty":
                                    CommandId = 413;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 909://多张连拍
                            switch (termcompany)
                            {
                                case "cj":
                                    CommandId  = 139;
                                    CommandPara = paras.get(0).toString() + "," + paras.get(1).toString() + ","
                                        + paras.get(2).toString() + "," + paras.get(3).toString() + "," + paras.get(4).toString();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 313://信息播报
                            switch (termcompany)
                            {
                                case "hx":
                                case "cj":
                                case "cx":
                                case "yx":
                                    if (paras.size() != 0)
                                    {
                                        //增加用户输入繁体，转化为简体，By zhangw
//                                ZHConverter converter = ZHConverter.getInstance(ZHConverter.SIMPLIFIED);
//                                //繁体转换简体
//                                cmdpara = converter.convert(paras.get(0).toString());
                                        // cmdpara  = ChineseConverter.Convert(paras[0], ChineseConversionDirection.TraditionalToSimplified);
                                        //cmdpara = paras[0];
                                    }
                                    CommandId  = 3;
                                    CommandPara = cmdpara;
                                    MsgcommandType = paras.get(paras.size() - 1).toString();
                                    break;
                                case "jtb":
                                    int isReply = Integer.parseInt(paras.get(1).toString());
                                    if (isReply == 1)
                                    {
                                        CommandId = 833;
                                    }
                                    else
                                    {
                                        CommandId = 806;
                                    }
                                    if (paras.size()>= 9)
                                    {//254
                                        CommandPara= String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                            + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2))+ "," + paras.get(8).toString();
                                    }
                                    else
                                    {
                                        CommandPara = "125" + "," + paras.get(0).toString();
                                    }
                                    break;
                                default:
                                    if (paras.size() != 0)
                                    {
                                        for(int i = 0; i < paras.size()- 1; i++)
                                        {
                                            cmdpara += paras.get(i) + ",";
                                        }
                                        cmdpara = cmdpara.substring(0, cmdpara.length() - 1);
                                    }
                                    CommandId = cmdId;
                                    CommandPara  = cmdpara;
                                    MsgcommandType = paras.get(paras.size() - 1).toString();
                                    break;
                            }
                            break;
                        case 3://信息发布
                            if (paras.size() != 0)
                            {
                                for (int i = 0; i < paras.size() - 1; i++)
                                {
                                    cmdpara += paras.get(i) + ",";
                                }
                                cmdpara = cmdpara.substring(0, cmdpara.length() - 1);
                            }
                            MsgcommandType = paras.get(paras.size() - 1).toString();
                            if (termcompany == "cj" && cmdpara.indexOf("请按键回复") >= 0)
                            {
                                CommandId  = 403;
                                CommandPara = cmdpara;//num + "," + cmdpara
                            }
                            else if (termcompany == "jtb")
                            {
                                int isReply = Integer.parseInt(paras.get(1).toString());
                                if (isReply == 1)
                                {
                                    CommandId= 833;
                                }
                                else
                                {
                                    CommandId = 806;
                                }
                                if (paras.size() >= 9)
                                {
                                    CommandPara= String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                        + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2))+ "," + paras.get(8).toString();
                                }
                                else
                                {
                                    CommandPara = "125" + "," + paras.get(0).toString();
                                }
                            }
                            break;
                        case 806://信息发布
                            if (termcompany == "jtb")
                            {
                                CommandId = 806;
                                if (paras.size() >= 9)
                                {
                                    CommandPara= String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                        + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2))+ "," + paras.get(8).toString();
                                }
                                else
                                {
                                    CommandPara = "125" + "," + paras.get(0).toString();
                                }
                            }
                            break;
                        case 833://信息发布
                            if (termcompany == "jtb")
                            {
                                CommandId  = 833;
                                if (paras.size() >= 9)
                                {
                                    CommandPara= String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                        + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2))+ "," + paras.get(8).toString();
                                }
                                else
                                {
                                    CommandPara = "125" + "," + paras.get(0).toString();
                                }
                            }
                            break;
                        case 808:
                            if (termcompany == "jtb")
                            {
                                CommandId  = 808;
                                if (paras.size() >= 11)
                                {
                                    String strPara= String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                        + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2))+ "," + paras.get(8).toString()+ paras.get(9).toString();
                                    String answers = paras.get(10).toString();//答案集合

                                    String [] paraArrayA = answers.split(" ;");
                                    for (int m = 0; m < paraArrayA.length - 1; m++)
                                    {
                                        String answerDet = paraArrayA[m];
                                        String[] paraArrayAD = answerDet.split(":");
                                        strPara += "," + paraArrayAD[0] + "," + paraArrayAD[1];
                                    }
                                    //+ "," + paras[10] + "," + paras[11]
                                    CommandPara = strPara;
                                }
                            }
                            break;
                        case 813:
                            if (termcompany == "jtb")
                            {
                                CommandId = 813;
                                if (paras.size() >= 8)
                                {
                                    CommandPara = String.valueOf(Integer.parseInt(paras.get(7).toString() + paras.get(6).toString() + paras.get(5).toString()
                                        + paras.get(4).toString() + paras.get(3).toString() + paras.get(2).toString() + paras.get(1).toString()+ paras.get(0).toString(),2));
                                }
                            }
                            break;
                        case 820:
                            if (termcompany == "jtb")
                            {
                                CommandId = 820;
                                if (paras.size() >= 6)
                                {
                                    boolean  isT = false;
                                    String proSet = paras.get(0).toString();
                                    int pro = Integer.parseInt(proSet,2);//二进制转为十进制
                                    String hasT = proSet.substring(proSet.length() - 1); //判断是否根据时间
                                    if (hasT.equals("1"))
                                    {
                                        isT = true;
                                    }
                                    String strPara = paras.get(1).toString() + "," + pro;
                                    if (isT)
                                    {
                                        strPara += "," + paras.get(2).toString() + "," + paras.get(3).toString();//根据时间参数加起止时间
                                    }
                                    strPara += "," + paras.get(4).toString();//取出拐点的个数
                                    //拼接拐点参数
                                    String Gpra = paras.get(5).toString();
                                    String[] paraGArray = Gpra.split(";");
                                    for (int m = 0; m < paraGArray.length-1;m++ )
                                    {
                                        char[] delimiterGSChars = { ':' };
                                        String[] paraGSArray = paraGArray[m].split(":");
                                        String proGSet = paras.get(5).toString();
                                        int Gpro = Integer.parseInt(proGSet, 2);//二进制转为十进制
                                        strPara += "," + paraGSArray[0] + "," + paraGSArray[1] + "," + paraGSArray[2] + "," + paraGSArray[3] + "," + paraGSArray[4] + "," + Gpro;
                                        String hasGT = proGSet.substring(proGSet.length() - 1); //判断是否根据时间
                                        boolean isGT = false;
                                        if (hasGT.equals("1"))
                                        {
                                            isGT = true;
                                        }
                                        if (isGT)
                                        {
                                            strPara += "," + paraGSArray[6] + "," + paraGSArray[7];
                                        }
                                        String hasGS = proGSet.substring(proGSet.length() - 2, 1); //判断是否根据超速及超速时间
                                        boolean isGS = false;
                                        if (hasGS.equals("1"))
                                        {
                                            isGS = true;
                                        }
                                        if (isGS)
                                        {
                                            strPara += "," + paraGSArray[8] + "," + paraGSArray[9];
                                        }
                                    }
                                    CommandPara = strPara;
                                }
                            }
                            break;
                        case 821:
                            if (termcompany == "jtb")
                            {
                                CommandId = 821;
                                if (paras.size() >= 1)
                                {
                                    CommandPara =  paras.get(0).toString() + "," + paras.get(1).toString();
                                }
                            }
                            break;
                        case  8011:
                            if (termcompany == "jtb")
                            {
                                CommandId = 821;
                                if (paras.size() >= 1)
                                {
                                    CommandPara = paras.get(0).toString() + "," + paras.get(1).toString();
                                }
                            }
                            break;
                        case  8012:
                            if (termcompany == "jtb")
                            {
                                CommandId = 801;
                                CommandPara =  "2,87," + paras.get(0).toString() + ",89," + paras.get(1).toString();
                            }
                            break;
                        default:
                            if (paras.size() != 0)
                            {
                                for (int i = 0; i < paras.size() - 1; i++)
                                {
                                    cmdpara += paras.get(i) + ",";
                                }
                                cmdpara = cmdpara.substring(0, cmdpara.length() - 1);
                            }
                            CommandId = cmdId;
                            CommandPara =cmdpara;
                            break;
                    }
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
                    Map<String, Object> mapDetail = GetUSerInfoUtil.getUSerInfo();
                    Date createdon = new Date();
                    String userId = mapDetail.get("userId").toString();
                    String keyid =carTerm.get("Keyid").toString();
                    String idx = UUID.randomUUID().toString();//bus表主键
                    String guid = UUID.randomUUID().toString();//查询结果的guid
                    String CommandIdx = sdf.format(createdon);

                    Map<String, Object> SendhisMap = new HashMap<String, Object>();
                    SendhisMap.put("idx", idx);
                    SendhisMap.put("CAR_ID", Carid);
                    SendhisMap.put("userId2", userId);
                    SendhisMap.put("createdon", createdon);
                    SendhisMap.put("description", dictMap.get("Description"));
                    SendhisMap.put("ip", ip);
                    msgSendMapper.saveTMsgSendHis(SendhisMap);

                    Map<String, Object> SendDetailMap = new HashMap<String, Object>();
                    SendDetailMap.put("idx", idx);
                    SendDetailMap.put("CAR_ID", Carid);
                    SendDetailMap.put("createdon", createdon);
                    SendDetailMap.put("userId2", userId);
                    SendDetailMap.put("guid", guid);
                    SendDetailMap.put("commandId", CommandId);
                    SendDetailMap.put("commandIdX", CommandIdx);
                    SendDetailMap.put("commandPara", CommandPara);
                    SendDetailMap.put("CHANNEL_ID", ChannelId);
                    msgSendMapper.saveMsgSendDetail(SendDetailMap);

                    Map<String, Object> SubmitMap = new HashMap<String, Object>();
                    SubmitMap.put("commandIdx", CommandIdx);
                    SubmitMap.put("commandId", CommandId);
                    SubmitMap.put("commandPara", CommandPara);
                    SubmitMap.put("KEY_ID", keyid);
                    SubmitMap.put("TERMID", createdon);
                    SubmitMap.put("CHANNEL_ID", ChannelId);
                    SubmitMap.put("SOCKET_IDX", "-1");
                    SubmitMap.put("COMPANYID", "lbs");
                    SubmitMap.put("USERID", userId);
                    SubmitMap.put("createdon", createdon);
                    SendDetailMap.put("guid", guid);
                    msgSendMapper.saveTMsgSubmit(SubmitMap);
                    idx=guid;
                }
            }

        //操作成功

        }

        return Idx;
    }

    @Override
    public List getLockCars(List carids) {
        Map<String,Object>paramMap = new HashMap<String,Object>();
        paramMap.put("caridList",carids);
        return msgSendMapper.getLockCar(paramMap);
    }


}
