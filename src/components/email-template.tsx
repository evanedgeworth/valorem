import { Body, Button, Container, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Text } from "@react-email/components";
import * as React from "react";

interface AirbnbReviewEmailProps {
  message: string;
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

export const EmailTemplate = ({ message }: AirbnbReviewEmailProps) => {
  const previewText = { message };

  return (
    <Html>
      <Head />
      {/* <Preview>{previewText}</Preview> */}

      <Body style={main}>
        <Section style={main}>
          <Container style={container}>
            <Section style={{ display: "flex", justifyContent: "flex-start" }}>
              <Container
                style={{
                  width: 120,
                }}
              >
                {/* <Logo /> */}
              </Container>
              <Img src={`/valorem.svg`} width="96" height="30" alt="Valorem" />
            </Section>

            <Section style={{ paddingBottom: "20px" }}>
              <Row>
                {/* <Text style={heading}>Here's what {fullname} wrote</Text>
                <Text style={review}>"{message}"</Text> */}
                <Text style={paragraph}>{message}</Text>

                <Button style={button} href="https://airbnb.com/">
                  Sign up
                </Button>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section>
              <Row>
                {/* <Text style={{ ...paragraph, fontWeight: '700' }}>
                    Common questions
                  </Text>
                  <Text>
                    <Link href="https://airbnb.com/help/article/13" style={link}>
                      How do reviews work?
                    </Link>
                  </Text>
                  <Text>
                    <Link
                      href="https://airbnb.com/help/article/1257"
                      style={link}
                    >
                      How do star ratings work?
                    </Link>
                  </Text>
                  <Text>
                    <Link href="https://airbnb.com/help/article/995" style={link}>
                      Can I leave a review after 14 days?
                    </Link>
                  </Text> */}
                {/* <Hr style={hr} /> */}
                <Text style={footer}>Valorem, 1234 Main St., San Francisco, CA 12345</Text>
                {/* <Link href="https://airbnb.com" style={reportLink}>
                  Report unsafe behavior
                </Link> */}
              </Row>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default EmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const userImage = {
  margin: "0 auto",
  marginBottom: "16px",
  borderRadius: "50%",
  backgroundColor: "gray",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#2563EB",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  paddingTop: 19,
  paddingBottom: 19,
};

const link = {
  ...paragraph,
  color: "#2563EB",
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};
