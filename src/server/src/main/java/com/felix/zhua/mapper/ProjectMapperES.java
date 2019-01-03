package com.felix.zhua.mapper;

import com.felix.zhua.model.Project;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface ProjectMapperES extends ElasticsearchRepository<Project.ES, Integer> {

}
