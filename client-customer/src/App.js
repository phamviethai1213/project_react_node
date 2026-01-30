// CLI : npm install axios --save
import axios from 'axios';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading...'
    };
  }

  render() {
    return (
      // Cần có thẻ bao bọc (như <div>) cho các phần tử JSX
      <div>
        <h1>Customer page</h1>
        <p>{this.state.message}</p> 
      </div>
    );
  }

  componentDidMount() {
    // Sửa lỗi cú pháp hàm mũi tên và khoảng trắng
    axios.get('/hello')
      .then((res) => {
        const result = res.data;
        this.setState({ message: result.message });
      })
      .catch((error) => {
        console.error("Lỗi kết nối:", error);
        this.setState({ message: "Lỗi tải dữ liệu" });
      });
  }
}

export default App;