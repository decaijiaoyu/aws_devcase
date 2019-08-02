package com.awspaas.user.apps.devcase.atExpression;

import com.actionsoft.bpms.commons.at.AbstExpression;
import com.actionsoft.bpms.commons.at.ExpressionContext;
import com.actionsoft.bpms.util.DBSql;
import com.actionsoft.exception.AWSExpressionException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class getDepartIdsByCompId extends AbstExpression {
    public getDepartIdsByCompId(ExpressionContext atContext, String expressionValue) {
        super(atContext, expressionValue);
    }

    @Override
    public String execute(String s) throws AWSExpressionException {
        String companyId = getParameter(s, 1);
        String ids = "";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBSql.open();
            String sql = "SELECT ID FROM orgdepartment WHERE COMPANYID =?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,companyId);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()){
                ids += resultSet.getString("ID")+",";
            }
            if(ids.length()>0){
                ids = ids.substring(0,ids.length());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        } finally {
            DBSql.close(connection, preparedStatement, resultSet);
        }

        return ids;
    }
}
