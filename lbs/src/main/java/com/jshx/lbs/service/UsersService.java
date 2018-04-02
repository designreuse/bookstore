package com.jshx.lbs.service;

import java.util.List;
import java.util.Map;

public interface UsersService {
    Map CheckSuperMan(String userId);
    Map getUserInfo(String userId);
    Map getCompanyInfoByUser(String companyId);
}
