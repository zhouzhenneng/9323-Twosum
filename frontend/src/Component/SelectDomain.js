import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function SelectDomain() {
  return (
      <>
        <Select
            defaultValue="computer science"
            style={{
                // width: 120,
                span: 16,
            }}
            onChange={handleChange}
        >
            <Option value="computer science">Computer science</Option>
            <Option value="business">Business</Option>
            <Option value="engineering">Engineering</Option>
            <Option value="science">Science</Option>
            <Option value="medicine">Medicine</Option>
            <Option value="law">Law</Option>
            <Option value="arts">Arts</Option>
      </Select>
    </>
  ) 
}
