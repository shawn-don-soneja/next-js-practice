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
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    
                    <h3 className={styles.header}>
                        MIT Open Courseware
                        <br/>
                        <a href="https://www.youtube.com/@mitocw" target="_blank">
                            <Badge bg="secondary" className={styles.badgeText}>Youtube Channel↗</Badge>
                        </a>
                    </h3>
                    <p className="m-3">
                        Just gonna wanna make some cells for the latest top 3 videos from the MIT Courseware channel
                    </p>
                </Card>
            </Col>
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>
                        Latest articles from Aljazeera
                        <br/>
                        <a href="https://www.aljazeera.com/" target="_blank">
                            <Badge bg="secondary" className={styles.badgeText}>News Feed↗</Badge>
                        </a>
                    </h3>
                    <p className="m-3">
                        Latest global news and updates
                    </p>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>
                        Youtube Playlist Links: 
                        <br/>
                        <a href="https://www.youtube.com/playlist?list=WL" target="_blank">
                            <Badge bg="secondary" className={styles.badgeText}>Watch Later↗</Badge>
                        </a>
                    </h3>
                </Card>
            </Col>
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>Random Ideas?<Badge bg="secondary" className={styles.badgeText}></Badge></h3>
                    <p>could be random trackers from looperman, for cakewalk</p>
                    <p>new vsts, or new music from certain artists</p>
                    <p>cool art if I can find such a feed</p>
                    <p>or even podcasts from certain folks</p>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>Quick Notes (persistent... supports like <i>bookmarks</i><Badge bg="secondary" className={styles.badgeText}></Badge></h3>
                </Card>
            </Col>
            <Col className="mb-4 d-inline-block justify-content-center" xs={12} md={6}>
                <Card className={styles.card}>
                    <h3 className={styles.header}>Add drag and drop reordering? + Reset<Badge bg="secondary" className={styles.badgeText}></Badge></h3>
                </Card>
            </Col>
        </Row>
    </Container>
  );
}