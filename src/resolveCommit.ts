async function resolveCommit (shaToResolve: string): Promise<?ResolvedSha> {
  try {
    await this.fetch();
    const revListArgs = ['rev-list', '-n', '1', '--no-abbrev-commit', '--format=oneline', shaToResolve];
    const stdout = await spawnGit(revListArgs, {cwd: this.cwd});
    const [sha] = stdout.split(/\s+/);
    return {sha, ref: undefined};
  } catch (err) {
    handleSpawnError(err);
    // assuming commit not found, let's try something else
    return null;
  }
}
