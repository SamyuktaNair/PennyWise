import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function Email({
  userName="Samy",
  type="budget-alert",
  data={
    percentageUsed:85,
    budgetAmount:4000,
    totalExpenses:3400,
    accountName
  }
}) {
  if(type=='monthly-report'){

  }
  if(type=='budget-alert'){
    return (
      <Html>
        <Head/>
        <Preview>Budget Alert</Preview>
        
        <Body style={styles.body}></Body>
        <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text} >Hello {userName}</Text>
            <Text style={styles.text}>
              You have used {data?.percentageUsed.toFixed(1)}% of your Monthly Budget of {accountName} account.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                  <Text style={styles.text}>
                    Budget Amount : Rs.{data?.budgetAmount}
                  </Text>
              </div>
              <div style={styles.stat}>
                  <Text style={styles.text}>
                    Spent so far: Rs.{data?.totalExpenses}
                  </Text>
              </div>
              <div style={styles.stat}>
                  <Text style={styles.text}>
                    Remaining: Rs.{data?.budgetAmount - data?.totalExpenses}
                  </Text>
              </div>
            </Section>
        </Container>
      </Html>
    );
  }
  

}

const styles = {
  body: {
    backgroundColor: "#f4f4f4",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "12px",
  },
  statsContainer: {
    marginTop: "20px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
  },
  stat: {
    marginBottom: "10px",
  },
};