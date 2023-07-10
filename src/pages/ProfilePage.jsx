import { Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileSidebar from "../components/ProfileSidebar";
import { getAuth } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) navigate("/login");
  const handleLogout = () => auth.signOut();

  return (
    <>
      <Container>
        <Row>
          <ProfileSidebar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  );
}
