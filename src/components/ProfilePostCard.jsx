import { Button, Col, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function ProfilePostCard({ content, post_id }) {
  const pic = "https://shorturl.at/twGJZ";
  const BASE_URL =
    "https://twitter-api-suwanki.sigma-school-full-stack.repl.co";
  const [likes, setLikes] = useState([]);

  // decoding the userId
  const token = localStorage.getItem("authToken");
  const decode = jwtDecode(token);
  const userId = decode.id;

  useEffect(() => {
    fetch(`${BASE_URL}/likes.post/${post_id}`)
      .then((response) => response.json())
      .then((data) => setLikes(data))
      .catch((error) => console.error("Error: ", error));
  }, [post_id]);

  // handling likes
  const isLiked = likes.some((like) => like.user_id === userId);
  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    setLikes([...likes, { user_id: userId }]);
    axios.post(`${BASE_URL}/likes`, {
      user_id: userId,
      post_id: post_id,
    });
  };

  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);
    if (like) {
      axios.delete(`${BASE_URL}/likes/${likes.likes_id}`);
      setLikes(likes.filter((like) => like.user_id !== userId));
    }
  };

  return (
    <Row
      className='p-3'
      style={{
        borderTop: "1px solid #D3D3D3",
        borderBottom: "1px solid #D3D3D3",
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>
      <Col>
        <strong>John Doe</strong>
        <span>@johntho * Apr 16</span>
        <p>{content}</p>
        <div className='d-flex justify-content-between'>
          <Button variant='light'>
            <i className='bi bi-chat'></i>
          </Button>
          <Button variant='light'>
            <i className='bi bi-repeat'></i>
          </Button>
          <Button variant='light' onClick={handleLike}>
            {isLiked ? (
              <i className='bi bi-heart-fill text-danger'></i>
            ) : (
              <i className='bi bi-heart'></i>
            )}
            {likes.length}
          </Button>
          <Button variant='light'>
            <i className='bi bi-graph-up'></i>
          </Button>
          <Button variant='light'>
            <i className='bi bi-upload'></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
