import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import Chart from "react-google-charts";
import styles from "../styles/fun.module.css";


export default function FunPage() {
  return (
    <Container className='macro-economic-dashboard'>
        <Row>
            <Col>
                <h1 className="mt-5 m-3">What</h1>
                <h5 className={styles.headerSpaced}></h5>
                <br/>
            </Col>
        </Row>
        <Row>
            <Col className="mb-4 d-inline-block justify-content-center" lg={true}>
                <Card className={styles.card}>
                    <p className="m-3">
                        Just gonna wanna make some cells for the latest top 3 videos from:
                        <br/>
                        <a href="https://www.youtube.com/@mitocw" target="_blank">MIT Open Courseware</a>
                    </p>
                </Card>
            </Col>
            <Col className="mb-4 d-inline-block justify-content-center" lg={true}>
                <Card className={styles.card}>
                    <p className="m-3">
                        Latest articles from Aljazeera
                        <br/>
                        <a href="" target="_blank">Al Jazeera</a>
                    </p>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col className="mb-4 d-inline-block justify-content-center" lg={true}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>1. GDP ($T): <Badge bg="secondary" className={styles.badgeText}></Badge></h3>
                </Card>
            </Col>
            <Col className="mb-4 d-inline-block justify-content-center" lg={true}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>1. GDP ($T): <Badge bg="secondary" className={styles.badgeText}></Badge></h3>
                </Card>
            </Col>
        </Row>
    </Container>
  );
}