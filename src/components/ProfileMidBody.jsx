import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser, fetchComments } from "../features/posts/postsSlice";

export default function ProfileMidBody() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const { currentUser } = useContext(AuthContext);

  // API URL
  const url =
    "https://wallpapers.com/images/hd/aesthetic-youtube-banner-background-2560-x-1440-zgnao5bu3uyje79v.jpg";
  const pic = "https://shorturl.at/twGJZ";

  useEffect(() => {
    dispatch(fetchPostsByUser(currentUser.uid));
  }, [dispatch, currentUser]);

  return (
    <Col sm={6} className='bg-light' style={{ border: "1px solid lightgrey" }}>
      <Image src={url} style={{ height: "200px", width: "100%" }} />
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
        <ProfilePostCard key={post.id} post={post} />
      ))}
    </Col>
  );
}
