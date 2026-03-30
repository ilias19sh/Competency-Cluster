import { Container, Stack, Group, Box, Divider } from '@mantine/core';
import { 
  CcButton, CcTitle, CcText, CcTag, 
  CcProgressBar, CcCircleProgress, CcCard 
} from '../components';

export default function Storybook() {
  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }} py="50px">
      <Container size="md">
        <Stack gap="50px">
          
          <Box>
            <CcTitle order={1}>Design System Storybook</CcTitle>
            <CcText dimmed>Répertoire exhaustif des composants Cc v1.0</CcText>
          </Box>

          {/* SECTION : TITRES */}
          <CcCard>
            <CcTitle order={2} withChevron={false}>CcTitle</CcTitle>
            <Stack gap="md">
              <CcTitle order={1}>Titre H1 par défaut</CcTitle>
              <CcTitle order={2} bold>Titre H2 Bold Montserrat</CcTitle>
              <CcTitle order={3} withChevron={false}>Titre H3 sans chevron</CcTitle>
              <CcTitle order={4} disabled>Titre H4 désactivé / archivé</CcTitle>
            </Stack>
          </CcCard>

          {/* SECTION : BOUTONS */}
          <CcCard>
            <CcTitle order={2} withChevron={false}>CcButton</CcTitle>
            <Stack gap="md">
              <Group>
                <CcButton>Gradient par défaut</CcButton>
                <CcButton variant="full-orange">Full Orange</CcButton>
                <CcButton variant="full-violet">Full Violet</CcButton>
              </Group>
              <Group>
                <CcButton size="xs">Taille XS</CcButton>
                <CcButton size="xl">Taille XL</CcButton>
                <CcButton disabled>Bouton désactivé</CcButton>
              </Group>
              <CcButton expandable>Bouton Expandable (100%)</CcButton>
            </Stack>
          </CcCard>

          {/* SECTION : TEXTES & TAGS */}
          <CcCard>
            <CcTitle order={2} withChevron={false}>CcText & CcTag</CcTitle>
            <Stack gap="md">
              <CcText size="lg">Texte Large Montserrat</CcText>
              <CcText>Texte Medium par défaut (#777777)</CcText>
              <CcText size="sm" italic>Texte Small Italic</CcText>
              <CcText bold color="orange">Texte Bold avec couleur custom</CcText>
              
              <Divider label="Tags" labelPosition="left" />
              
              <Group gap="xs">
                <CcTag>React</CcTag>
                <CcTag>TypeScript</CcTag>
                <CcTag>Mantine</CcTag>
                <CcTag>Node.js</CcTag>
                <CcTag>Expert</CcTag>
              </Group>
            </Stack>
          </CcCard>

          {/* SECTION : PROGRESS BARS DROITES */}
          <CcCard>
            <CcTitle order={2} withChevron={false}>CcProgressBar</CcTitle>
            <Stack gap="xl">
              <CcProgressBar label="Début de parcours" value={15} />
              <CcProgressBar label="Progression intermédiaire" value={50} size="lg" />
              <CcProgressBar label="Expertise acquise" value={90} />
              <CcProgressBar label="Maîtrise totale" value={100} />
            </Stack>
          </CcCard>

          {/* SECTION : CIRCLE PROGRESS */}
          <CcCard>
            <CcTitle order={2} withChevron={false}>CcCircleProgress</CcTitle>
            <Group justify="space-around" align="flex-end" py="lg">
              {/* Cas 0% */}
              <CcCircleProgress value={0} label="React" size={120}/>

              {/* Cas 35% */}
              <CcCircleProgress value={35} label="Git" size={140}/>

              {/* Cas 75% - Ton exemple Figma */}
              <CcCircleProgress value={75} label="Anglais" size={200}/>

              {/* Cas 100% */}
              <CcCircleProgress value={100} label="Docker" size={140}/>
            </Group>
          </CcCard>

        </Stack>
      </Container>
    </Box>
  );
}