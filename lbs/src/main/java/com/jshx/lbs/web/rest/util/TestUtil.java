package com.jshx.lbs.web.rest.util;

import com.jshx.lbs.repository.TreeArrayDataRepository;

import java.util.List;

public class TestUtil {

    private String userName = "cesi";

    private String companyId = "3184c8fd-24f0-4a00-9067-7df97ed3cd8b";

    private final TreeArrayDataRepository treeArrayDataRepository;

    public  TestUtil(TreeArrayDataRepository treeArrayDataRepository)
    {
        this.treeArrayDataRepository = treeArrayDataRepository;
    }

    public List<String> getSqlData()
    {
      List<String> list = treeArrayDataRepository.getUserId(userName,companyId);

        return list;
    }
}
