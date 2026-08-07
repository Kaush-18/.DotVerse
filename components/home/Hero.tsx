import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";

import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import HeroBackground from "./HeroBackground";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <Section>

      <HeroBackground />

      <Container>

        <Grid>

          <HeroContent />

          <HeroScene />

        </Grid>

      </Container>

      <ScrollIndicator />

    </Section>
  );
}