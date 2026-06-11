package com.taskmanager.backend;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BackendApplicationTests {

	@Test
	void applicationClassShouldBeAvailable() {
		assertThat(BackendApplication.class).isNotNull();
	}

}
