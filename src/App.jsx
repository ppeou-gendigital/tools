import { Box, Stack, Text, Title } from '@mantine/core'

// Scaffolding shell. The report flow lands in the next commits.
export default function App() {
  return (
    <Box className="app" p="md">
      <Stack gap={4}>
        <Title order={4}>Jira Capacity</Title>
        <Text size="xs" c="dimmed">
          Scaffolding — the report flow is being ported.
        </Text>
      </Stack>
    </Box>
  )
}
