import {
  Button,
  Col,
  Image,
  Nav,
  Row,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function ProfileMidBody() {
  // states
  // const [userId, setUserId] = useState("");

  // const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);

  // const [about, setAbout] = useState("");
  // const [newContent, setNewContent] = useState("");
  // const [showModal, setShowModal] = useState(false);

  // API URL
  const url =
    "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic = "https://shorturl.at/twGJZ";

  // Functions
  // const handleShow = (e) => {
  //   e.preventDefault();
  //   setShowModal(true);
  //   console.log("clicked");
  // };

  // get posts
  // const fetchPosts = (userId) => {
  //   fetch(
  //     `https://twitter-api-suwanki.sigma-school-full-stack.repl.co/posts/user/${userId}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setPosts(data))
  //     .catch((error) => console.error("Error:", error));
  // };

  // get about
  // const fetchAbout = (userId) => {
  //   fetch(
  //     `https://twitter-api-suwanki.sigma-school-full-stack.repl.co/about/user/${userId}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setAbout(data))
  //     .catch((error) => console.error("Error:", error));
  // };

  // update about
  // const updateAbout = (userId, newContent) => {
  //   fetch(
  //     `https://twitter-api-suwanki.sigma-school-full-stack.repl.co/about/user/${userId}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ content: newContent }),
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Content updated successfully:", data);
  //       // Perform any additional actions after successful update
  //       console.log(newContent);
  //       setShowModal(false);
  //     })
  //     .catch((error) => console.error("Error:", error));
  // };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;
      // console.log(userId);
      // setUserId(userId);
      dispatch(fetchPostsByUser(userId));
      // fetchAbout(userId);
    }
  }, [dispatch]);

  return (
    <Col sm={6} className='bg-light' style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft: 15,
        }}
      />
      <Row className='justify-content-end'>
        <Col xs='auto'>
          <Button
            className='rounded-pill mt-2'
            variant='outline-secondary'
            // onClick={handleShow}
          >
            Edit Profile
          </Button>
        </Col>
      </Row>

      {/* <Modal show={showModal}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <p>Edit About</p>
          <Form>
            <Form.Group controlId='editAbout'>
              <Form.Control
                placeholder={about}
                as='textarea'
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='danger'
            className='rounded-pill'
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button
            variant='primary'
            className='rounded-pill'
            onClick={() => updateAbout(userId, newContent)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal> */}

      <p
        className='mt-5'
        style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}
      >
        John Tho
      </p>
      <p style={{ marginBottom: "2px" }}>@johntho22</p>
      <p className='biography'>henlo</p>
      <p>
        <strong>Web developer</strong>
      </p>
      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant='underline' defaultActiveKey='/home' justify>
        <Nav.Item>
          <Nav.Link eventKey='/home'>Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='link-1'>Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='link-2'>Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='link-3'>Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey='link-4'>Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && (
        <Spinner animation='border' className='ms-3 mt-3' variant='primary' />
      )}
      {posts.map((post) => (
        <ProfilePostCard key={post.id} content={post.content} />
      ))}
    </Col>
  );
}
